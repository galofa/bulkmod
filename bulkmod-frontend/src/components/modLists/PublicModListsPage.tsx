import React, { useState, useEffect } from 'react';
import { ModList } from './types';
import modListService from '../../services/modListService';
import { Button, Card, Alert } from '../ui';
import { FiCopy, FiUser, FiPackage, FiEye } from 'react-icons/fi';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../common/Footer';

interface PublicModList extends ModList {
  user: {
    id: number;
    username: string;
  };
}

const EmptyStateIcon = () => (
  <img 
    src="/favicon.svg" 
    alt="BulkMod Logo" 
    className="w-16 h-16 mx-auto mb-4 opacity-60" 
  />
);

export default function PublicModListsPage() {
  const [publicModLists, setPublicModLists] = useState<PublicModList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState<number | null>(null);
  const { showNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    loadPublicModLists();
  }, []);

  const loadPublicModLists = async () => {
    try {
      setLoading(true);
      const modLists = await modListService.getPublicModLists();
      setPublicModLists(modLists);
    } catch (err) {
      setError('Failed to load public mod lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyModList = async (modListId: number) => {
    if (!user) {
      showNotification('Please log in to copy mod lists', 'error');
      return;
    }

    try {
      setCopying(modListId);
      const newModList = await modListService.copyPublicModList(modListId);
      showNotification(`Successfully copied "${newModList.name}" to your mod lists!`, 'success');
    } catch (err) {
      showNotification('Failed to copy mod list', 'error');
    } finally {
      setCopying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-green-300 text-xl">Loading public mod lists...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
      <main className="flex-grow p-6 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-300 mb-4">Public Mod Lists</h1>
            <p className="text-slate-300 text-lg">
              Discover and copy mod lists created by the community
            </p>
          </div>

          {error && (
            <Alert variant="error" onClose={() => setError(null)} className="mb-6">
              {error}
            </Alert>
          )}

          {publicModLists.length === 0 ? (
            <Card className="text-center py-12">
              <EmptyStateIcon />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No public mod lists yet</h3>
              <p className="text-slate-400 mb-6">
                Be the first to create a public mod list and share it with the community!
              </p>
              <Button 
                onClick={() => window.location.href = '/modlists'} 
                className="flex items-center gap-2 mx-auto"
              >
                <FiPackage />
                Go to My Mod Lists
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicModLists.map((modList) => (
                <Card key={modList.id} className="p-6 flex flex-col min-h-[400px]">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-green-300 mb-2">
                          {modList.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                          <FiUser className="w-4 h-4" />
                          <span>by {modList.user.username}</span>
                        </div>
                        {modList.description && (
                          <p className="text-slate-400 text-sm mb-3">
                            {modList.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {modList.mods && modList.mods.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Recent mods:</h4>
                        <div className="space-y-2">
                          {modList.mods.slice(0, 3).map((mod) => (
                            <div key={mod.id} className="flex items-center gap-2 p-2 bg-slate-800 rounded">
                              <img
                                src={mod.modIconUrl || "/favicon.svg"}
                                alt={mod.modTitle}
                                className="w-6 h-6 rounded bg-slate-700 object-cover"
                                onError={(e) => ((e.target as HTMLImageElement).src = "/favicon.svg")}
                              />
                              <div className="flex-1 min-w-0">
                                <a
                                  href={`https://modrinth.com/${mod.modSlug.includes('plugin') ? 'plugin' : 'mod'}/${mod.modSlug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-green-300 hover:underline truncate block"
                                >
                                  {mod.modTitle}
                                </a>
                                <p className="text-xs text-slate-400">by {mod.modAuthor}</p>
                              </div>
                            </div>
                          ))}
                          {modList.mods.length > 3 && (
                            <p className="text-xs text-slate-500 text-center">
                              +{(modList._count?.mods || modList.mods.length) - 3} more mods
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Button
                      onClick={() => handleCopyModList(modList.id)}
                      disabled={copying === modList.id || !user}
                      className="flex-1 flex items-center justify-center gap-2"
                      variant="primary"
                      size="sm"
                    >
                      <FiCopy className="w-4 h-4" />
                      {copying === modList.id ? 'Copying...' : 'Copy to My Lists'}
                    </Button>
                  </div>
                  {!user && (
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Log in to copy this mod list
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
