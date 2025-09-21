import React, { useState, useEffect } from 'react';
import { ModList, CreateModListData } from './types';
import modListService from '../../services/modListService';
import { Button, Modal, Input, Alert } from '../ui';

interface ModListSelectorProps {
  modSlug: string;
  modTitle: string;
  modIconUrl?: string;
  modAuthor: string;
  onClose: () => void;
  isOpen: boolean;
}

export default function ModListSelector({
  modSlug,
  modTitle,
  modIconUrl,
  modAuthor,
  onClose,
  isOpen,
}: ModListSelectorProps) {
  const [modlists, setModLists] = useState<ModList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newModListData, setNewModListData] = useState<CreateModListData>({
    name: '',
    description: '',
    isPublic: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadModLists();
    }
  }, [isOpen]);

  const loadModLists = async () => {
    try {
      setLoading(true);
      const userModLists = await modListService.getUserModLists();
      setModLists(userModLists);
    } catch (err) {
      setError('Failed to load mod lists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToModList = async (modListId: number) => {
    try {
      setLoading(true);
      await modListService.addModToModList(modListId, {
        modSlug,
        modTitle,
        modIconUrl,
        modAuthor,
      });
      onClose();
    } catch (err) {
      setError('Failed to add mod to mod list');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModList = async () => {
    if (!newModListData.name.trim()) {
      setError('Mod List name is required');
      return;
    }
    try {
      setLoading(true);
      const newModList = await modListService.createModList(newModListData);
      setModLists([newModList, ...modlists]);
      setShowCreateForm(false);
      setNewModListData({ name: '', description: '', isPublic: false });
    } catch (err) {
      setError('Failed to create mod list');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromModList = async (modListId: number) => {
    try {
      setLoading(true);
      await modListService.removeModFromModList(modListId, modSlug);
      await loadModLists();
    } catch (err) {
      setError('Failed to remove mod from mod list');
    } finally {
      setLoading(false);
    }
  };

  const isModInModList = (modlist: ModList) => {
    return modlist.mods.some(mod => mod.modSlug === modSlug);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Mod List">
      <div className="space-y-4">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <div className="bg-slate-800 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={modIconUrl || "/favicon.svg"}
              alt={modTitle}
              className="w-12 h-12 rounded bg-slate-700 object-cover"
              onError={(e) => ((e.target as HTMLImageElement).src = "/favicon.svg")}
            />
            <div>
              <h4 className="font-semibold text-green-300">{modTitle}</h4>
              <p className="text-sm text-slate-400">by {modAuthor}</p>
            </div>
          </div>
        </div>
        {!showCreateForm ? (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Mod Lists</h3>
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="outline"
                size="sm"
              >
                Create New
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-4">Loading mod lists...</div>
            ) : modlists.length === 0 ? (
              <div className="text-center py-4 text-slate-400">
                No mod lists yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {modlists.map((modlist) => {
                  const isInModList = isModInModList(modlist);
                  return (
                    <div
                      key={modlist.id}
                      className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-green-300">{modlist.name}</h4>
                        {modlist.description && (
                          <p className="text-sm text-slate-400">{modlist.description}</p>
                        )}
                        <p className="text-xs text-slate-500">
                          {modlist._count?.mods || modlist.mods.length} mods
                        </p>
                      </div>
                      <Button
                        onClick={() =>
                          isInModList
                            ? handleRemoveFromModList(modlist.id)
                            : handleAddToModList(modlist.id)
                        }
                        variant={isInModList ? "danger" : "primary"}
                        size="sm"
                        disabled={loading}
                      >
                        {isInModList ? "Remove" : "Add"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create New Mod List</h3>
            <div className="space-y-3">
              <Input
                label="Mod List Name"
                value={newModListData.name}
                onChange={(e) =>
                  setNewModListData({ ...newModListData, name: e.target.value })
                }
                placeholder="My Awesome Modpack"
                required
              />
              <Input
                label="Description (optional)"
                value={newModListData.description || ''}
                onChange={(e) =>
                  setNewModListData({ ...newModListData, description: e.target.value })
                }
                placeholder="A collection of my favorite mods"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newModListData.isPublic}
                  onChange={(e) =>
                    setNewModListData({ ...newModListData, isPublic: e.target.checked })
                  }
                  className="rounded border-slate-600 bg-slate-700 text-green-400 focus:ring-green-400"
                />
                <span className="text-sm">Make mod list public</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateModList}
                disabled={loading || !newModListData.name.trim()}
                className="flex-1"
              >
                Create Mod List
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
