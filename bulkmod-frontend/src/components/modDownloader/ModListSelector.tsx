import React, { useState, useEffect } from 'react';
import { ModList } from '../modLists/types';
import modListService from '../../services/modListService';

interface ModListSelectorProps {
  selectedModList: ModList | null;
  onModListSelect: (modList: ModList | null) => void;
}

export default function ModListSelector({ selectedModList, onModListSelect }: ModListSelectorProps) {
  const [modLists, setModLists] = useState<ModList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModLists();
  }, []);

  const loadModLists = async () => {
    try {
      setLoading(true);
      const lists = await modListService.getUserModLists();
      setModLists(lists);
    } catch (error) {
      console.error('Failed to load mod lists:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <label htmlFor="modList" className="block mb-1 font-medium text-green-300">
          Mod List
        </label>
        <select
          id="modList"
          disabled
          className="w-full p-3 rounded bg-slate-700 border border-green-600 text-white"
        >
          <option value="">Loading mod lists...</option>
        </select>
      </div>
    );
  }

  if (modLists.length === 0) {
    return (
      <div className="mb-6">
        <label htmlFor="modList" className="block mb-1 font-medium text-green-300">
          Mod List
        </label>
        <select
          id="modList"
          disabled
          className="w-full p-3 rounded bg-slate-700 border border-green-600 text-white"
        >
          <option value="">No mod lists found - Create one first</option>
        </select>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor="modList" className="block mb-1 font-medium text-green-300">
        Mod List
      </label>
      <select
        id="modList"
        value={selectedModList?.id || ''}
        onChange={(e) => {
          const modListId = e.target.value;
          if (modListId) {
            const modList = modLists.find(ml => ml.id === parseInt(modListId));
            onModListSelect(modList || null);
          } else {
            onModListSelect(null);
          }
        }}
        className="w-full p-3 rounded bg-slate-700 border border-green-600 text-white"
      >
        <option value="">Select mod list</option>
        {modLists.map((modList) => (
          <option key={modList.id} value={modList.id}>
            {modList.name} ({modList._count?.mods || modList.mods.length} mods)
          </option>
        ))}
      </select>
    </div>
  );
}
