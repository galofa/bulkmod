export interface ModrinthProject {
  slug: string;
  title: string;
  description: string;
  project_type: string;
  client_side: string;
  server_side: string;
  author: string;
  downloads: number;
  follows: number;
  project_id: string;
  icon_url?: string;
  color?: number;
  created: string;
  updated: string;
  published: string;
  categories: string[];
  versions: string[];
  loaders: string[];
  gallery?: ModrinthGalleryItem[];
  featured_gallery?: string;
  team: string;
  issues_url?: string;
  source_url?: string;
  wiki_url?: string;
  discord_url?: string;
  donation_urls?: ModrinthDonationUrl[];
  status: string;
  license?: ModrinthLicense;
  body?: string;
  moderator_message?: ModrinthModeratorMessage;
}

export interface ModrinthGalleryItem {
  url: string;
  featured: boolean;
  title?: string;
  description?: string;
  created: string;
  ordering: number;
}

export interface ModrinthDonationUrl {
  id: string;
  platform: string;
  url: string;
}

export interface ModrinthLicense {
  id: string;
  name: string;
  url?: string;
}

export interface ModrinthModeratorMessage {
  message: string;
  body?: string;
}

export interface ModrinthSearchResponse {
  hits: ModrinthProject[];
  offset: number;
  limit: number;
  total_hits: number;
}

// ModList types
export interface ModList {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  mods: ModListMod[];
  _count?: {
    mods: number;
  };
}

export interface ModListMod {
  id: number;
  modListId: number;
  modSlug: string;
  modTitle: string;
  modIconUrl?: string;
  modAuthor: string;
  addedAt: string;
}

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