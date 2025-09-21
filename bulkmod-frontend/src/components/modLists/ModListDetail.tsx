import React, { useState, useEffect } from 'react';
import { ModList, ModListMod } from './types';
import modListService from '../../services/modListService';
import { Button, Modal, Alert, Card } from '../ui';
import ConfirmationModal from '../ui/ConfirmationModal';
import { FiTrash2, FiExternalLink, FiArrowLeft, FiEdit3 } from 'react-icons/fi';
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

  return (
    <Modal isOpen={true} onClose={onClose} title={`${modlist.name} - Mods`} size="lg">
      <div className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-green-300">{modlist.name}</h2>
            {modlist.description && (
              <p className="text-slate-400 text-sm">{modlist.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              {mods.length} mod{mods.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

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

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
          <Button onClick={onClose} variant="outline">
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
