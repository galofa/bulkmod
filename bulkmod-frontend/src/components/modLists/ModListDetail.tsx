import React, { useState, useEffect } from 'react';
import { ModList, ModListMod } from './types';
import modListService from '../../services/modListService';
import { Button, Modal, Alert, Card, Input } from '../ui';
import ConfirmationModal from '../ui/ConfirmationModal';
import { FiTrash2, FiExternalLink, FiArrowLeft, FiEdit3, FiCheck, FiX } from 'react-icons/fi';
import { useNotification } from '../../contexts/NotificationContext';

interface ModListDetailProps {
  modlist: ModList;
  onClose: () => void;
  onModListUpdated: () => void;
}

export default function ModListDetail({ modlist, onClose, onModListUpdated }: ModListDetailProps) {
  const [mods, setMods] = useState<ModListMod[]>(modlist.mods || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modToDelete, setModToDelete] = useState<{ slug: string; title: string } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(modlist.name);
  const [currentName, setCurrentName] = useState(modlist.name);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(modlist.description || '');
  const [currentDescription, setCurrentDescription] = useState(modlist.description || '');
  const [currentIsPublic, setCurrentIsPublic] = useState(modlist.isPublic);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadMods();
  }, [modlist.id]);

  const loadMods = async () => {
    try {
      setLoading(true);
      const updatedModList = await modListService.getModList(modlist.id);
      setMods(updatedModList.mods || []);
    } catch (err) {
      setError('Failed to load mods');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMod = async (modSlug: string, modTitle: string) => {
    setModToDelete({ slug: modSlug, title: modTitle });
    setShowDeleteModal(true);
  };

  const confirmRemoveMod = async () => {
    if (!modToDelete) return;

    try {
      setLoading(true);
      await modListService.removeModFromModList(modlist.id, modToDelete.slug);
      setMods(mods.filter(mod => mod.modSlug !== modToDelete.slug));
      showNotification(`"${modToDelete.title}" removed from mod list`, 'success');
      onModListUpdated();
    } catch (err) {
      setError('Failed to remove mod from mod list');
      showNotification('Failed to remove mod from mod list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getModrinthUrl = (mod: ModListMod) => {
    // Check if the slug contains plugin info or if we need to determine the type
    // For now, we'll assume it's a mod unless the slug suggests otherwise
    const isPlugin = mod.modSlug.includes('plugin') || mod.modSlug.includes('worldedit') || mod.modSlug.includes('chunky');
    return `https://modrinth.com/${isPlugin ? 'plugin' : 'mod'}/${mod.modSlug}`;
  };

  const handleStartEdit = () => {
    setIsEditingName(true);
    setEditedName(currentName);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(currentName);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      showNotification('Mod list name cannot be empty', 'error');
      return;
    }

    if (editedName.trim() === currentName) {
      setIsEditingName(false);
      return;
    }

    try {
      setUpdateLoading(true);
      await modListService.updateModList(modlist.id, { name: editedName.trim() });
      setCurrentName(editedName.trim());
      showNotification(`Mod list renamed to "${editedName.trim()}"`, 'success');
      onModListUpdated();
      setIsEditingName(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update mod list name';
      showNotification(errorMessage, 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleStartEditDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(currentDescription);
  };

  const handleCancelEditDescription = () => {
    setIsEditingDescription(false);
    setEditedDescription(currentDescription);
  };

  const handleSaveDescription = async () => {
    if (editedDescription.trim() === currentDescription) {
      setIsEditingDescription(false);
      return;
    }

    try {
      setUpdateLoading(true);
      await modListService.updateModList(modlist.id, { description: editedDescription.trim() });
      setCurrentDescription(editedDescription.trim());
      showNotification('Description updated successfully!', 'success');
      onModListUpdated();
      setIsEditingDescription(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update description';
      showNotification(errorMessage, 'error');
    } finally {
      setUpdateLoading(false);
    }
  };


  const handleSavePublic = async () => {
    const newPublicStatus = !currentIsPublic;

    try {
      setUpdateLoading(true);
      await modListService.updateModList(modlist.id, { isPublic: newPublicStatus });
      setCurrentIsPublic(newPublicStatus);
      showNotification(`Mod list is now ${newPublicStatus ? 'public' : 'private'}!`, 'success');
      onModListUpdated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update public status';
      showNotification(errorMessage, 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const customHeader = (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-2">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-xl font-semibold text-green-300"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleSaveName}
              disabled={updateLoading || !editedName.trim()}
              className="flex items-center gap-1"
            >
              <FiCheck />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={updateLoading}
              className="flex items-center gap-1"
            >
              <FiX />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-green-300">{currentName}</h2>
            <button
              onClick={handleStartEdit}
              className="text-slate-400 hover:text-white transition-colors"
              disabled={updateLoading}
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-slate-700 rounded transition-colors"
      >
        <FiX className="w-5 h-5 text-slate-400" />
      </button>
    </div>
  );

  const descriptionSection = (
    <div className="px-6 py-4 border-b border-green-500/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditingDescription ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-green-200">Description</label>
              <div className="flex items-center gap-2">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSaveDescription();
                    } else if (e.key === 'Escape') {
                      handleCancelEditDescription();
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-green-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Add a description for your mod list..."
                  rows={3}
                  autoFocus
                />
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    onClick={handleSaveDescription}
                    disabled={updateLoading || editedDescription.trim() === currentDescription}
                    className="flex items-center gap-1"
                  >
                    <FiCheck />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEditDescription}
                    disabled={updateLoading}
                    className="flex items-center gap-1"
                  >
                    <FiX />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-green-200 mb-1">Description</label>
                {currentDescription ? (
                  <p className="text-slate-300 text-sm">{currentDescription}</p>
                ) : (
                  <p className="text-slate-500 text-sm italic">No description added</p>
                )}
              </div>
              <button
                onClick={handleStartEditDescription}
                className="text-slate-400 hover:text-white transition-colors mt-5"
                disabled={updateLoading}
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const publicStatusSection = (
    <div className="px-6 py-4 border-b border-green-500/20">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="block text-sm font-medium text-green-200 mb-2">Visibility</label>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${currentIsPublic ? 'text-slate-400' : 'text-slate-300'}`}>
              Private
            </span>
            <button
              onClick={handleSavePublic}
              disabled={updateLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                currentIsPublic ? 'bg-green-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentIsPublic ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${currentIsPublic ? 'text-slate-300' : 'text-slate-400'}`}>
              Public
            </span>
            <span className="text-xs text-slate-500 ml-2">
              {currentIsPublic ? 'Visible to everyone' : 'Only visible to you'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onClose} customHeader={customHeader} size="lg">
      {descriptionSection}
      {publicStatusSection}
      <div className="space-y-4 p-6">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}


        {loading && mods.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400">Loading mods...</div>
          </div>
        ) : mods.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-slate-400 mb-4">No mods in this list yet</div>
            <p className="text-sm text-slate-500">
              Add mods to this list from the search page
            </p>
          </Card>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {mods.map((mod) => (
              <Card key={mod.id} className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={mod.modIconUrl || "/favicon.svg"}
                    alt={mod.modTitle}
                    className="w-12 h-12 rounded bg-slate-700 object-cover flex-shrink-0"
                    onError={(e) => ((e.target as HTMLImageElement).src = "/favicon.svg")}
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href={getModrinthUrl(mod)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-green-300 hover:underline truncate block"
                    >
                      {mod.modTitle}
                    </a>
                    <p className="text-sm text-slate-400">by {mod.modAuthor}</p>
                    <p className="text-xs text-slate-500">
                      Added {new Date(mod.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getModrinthUrl(mod), '_blank')}
                      className="flex items-center gap-1"
                    >
                      <FiExternalLink />
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveMod(mod.modSlug, mod.modTitle)}
                      disabled={loading}
                      className="flex items-center gap-1"
                    >
                      <FiTrash2 />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <span className="text-sm text-slate-500">
            {mods.length} mod{mods.length !== 1 ? 's' : ''}
          </span>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmRemoveMod}
        title="Remove Mod"
        message={`Are you sure you want to remove "${modToDelete?.title}" from this mod list?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />
    </Modal>
  );
}
