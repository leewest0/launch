export interface AppEntry {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  addedBy: string;
  createdAt: number;
}

export interface DashboardData {
  user: string;
  apps: AppEntry[];
  favourites: string[];
  recents: string[];
}
