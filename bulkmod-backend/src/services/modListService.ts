import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateModListData {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddModToModListData {
  modSlug: string;
  modTitle: string;
  modIconUrl?: string;
  modAuthor: string;
}

export class ModListService {
  // Create a new modlist
  async createModList(userId: number, data: CreateModListData) {
    return await prisma.modList.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
      include: {
        mods: true,
      },
    });
  }

  // Get all modlists for a user
  async getUserModLists(userId: number) {
    return await prisma.modList.findMany({
      where: { userId },
      include: {
        mods: {
          orderBy: { addedAt: 'desc' },
          take: 5, // Only load first 5 mods for preview
        },
        _count: {
          select: { mods: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Get all public modlists with creator info
  async getPublicModLists() {
    return await prisma.modList.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        mods: {
          orderBy: { addedAt: 'desc' },
          take: 5, // Only load first 5 mods for preview
        },
        _count: {
          select: { mods: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Copy a public modlist to user's account
  async copyPublicModList(publicModListId: number, userId: number) {
    // First, get the public modlist with all its mods
    const publicModList = await prisma.modList.findFirst({
      where: {
        id: publicModListId,
        isPublic: true,
      },
      include: {
        mods: true,
      },
    });

    if (!publicModList) {
      throw new Error('Public mod list not found');
    }

    // Create a new modlist for the user
    const newModList = await prisma.modList.create({
      data: {
        name: `${publicModList.name} (Copy)`,
        description: publicModList.description,
        isPublic: false, // Copied modlists are private by default
        userId,
      },
    });

    // Copy all mods from the public modlist
    if (publicModList.mods.length > 0) {
      await prisma.modListMod.createMany({
        data: publicModList.mods.map(mod => ({
          modListId: newModList.id,
          modSlug: mod.modSlug,
          modTitle: mod.modTitle,
          modIconUrl: mod.modIconUrl,
          modAuthor: mod.modAuthor,
        })),
      });
    }

    // Return the new modlist with mods
    return await prisma.modList.findUnique({
      where: { id: newModList.id },
      include: {
        mods: {
          orderBy: { addedAt: 'desc' },
        },
        _count: {
          select: { mods: true },
        },
      },
    });
  }

  // Get a specific modlist with its mods
  async getModList(modListId: number, userId: number) {
    return await prisma.modList.findFirst({
      where: {
        id: modListId,
        userId,
      },
      include: {
        mods: {
          orderBy: { addedAt: 'desc' },
        },
      },
    });
  }

  // Update modlist details
  async updateModList(modListId: number, userId: number, data: Partial<CreateModListData>) {
    return await prisma.modList.updateMany({
      where: {
        id: modListId,
        userId,
      },
      data,
    });
  }

  // Delete a modlist
  async deleteModList(modListId: number, userId: number) {
    return await prisma.modList.deleteMany({
      where: {
        id: modListId,
        userId,
      },
    });
  }

  // Add a mod to a modlist
  async addModToModList(modListId: number, userId: number, modData: AddModToModListData) {
    // Verify modlist belongs to user
    const modlist = await prisma.modList.findFirst({
      where: {
        id: modListId,
        userId,
      },
    });

    if (!modlist) {
      throw new Error('Mod List not found or access denied');
    }

    return await prisma.modListMod.create({
      data: {
        modListId,
        ...modData,
      },
    });
  }

  // Remove a mod from a modlist
  async removeModFromModList(modListId: number, userId: number, modSlug: string) {
    // Verify modlist belongs to user
    const modlist = await prisma.modList.findFirst({
      where: {
        id: modListId,
        userId,
      },
    });

    if (!modlist) {
      throw new Error('Mod List not found or access denied');
    }

    return await prisma.modListMod.deleteMany({
      where: {
        modListId,
        modSlug,
      },
    });
  }

  // Check if a mod is in a specific modlist
  async isModInModList(modListId: number, modSlug: string) {
    const modListMod = await prisma.modListMod.findUnique({
      where: {
        modListId_modSlug: {
          modListId,
          modSlug,
        },
      },
    });
    return !!modListMod;
  }

  // Get all modlists containing a specific mod
  async getModListsContainingMod(userId: number, modSlug: string) {
    return await prisma.modList.findMany({
      where: {
        userId,
        mods: {
          some: {
            modSlug,
          },
        },
      },
      include: {
        _count: {
          select: { mods: true },
        },
      },
    });
  }
}
