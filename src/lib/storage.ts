export type AssetType = 'image' | 'video' | 'script' | 'avatar' | 'audio';

export interface Asset {
  id: string;
  type: AssetType;
  title: string;
  src?: string; // for images/videos/audio
  content?: string; // for scripts or metadata
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  assets: Asset[];
}

const PROJECTS_KEY = 'hg_projects';

export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function getProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    localStorage.removeItem(PROJECTS_KEY);
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function seedProjectsIfEmpty() {
  const existing = getProjects();
  if (existing.length > 0) return;
  const now = Date.now();
  const sample: Project[] = [
    {
      id: uid(),
      name: 'Neon Car Launch',
      createdAt: now - 1000 * 60 * 60 * 24 * 5,
      assets: [
        { id: uid(), type: 'image', title: 'Car Hero', src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', createdAt: now },
        { id: uid(), type: 'script', title: '30s Spot', content: 'Feel the speed. Experience the future. Drive the neon edge.', createdAt: now },
      ],
    },
    {
      id: uid(),
      name: 'Sneaker Hype Drop',
      createdAt: now - 1000 * 60 * 60 * 24 * 9,
      assets: [
        { id: uid(), type: 'image', title: 'Sneaker Shot', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', createdAt: now },
        { id: uid(), type: 'script', title: 'IG Caption', content: 'Sky-high style meets neon energy. Drop incoming.', createdAt: now },
        { id: uid(), type: 'audio', title: 'Swoosh FX', content: 'fx:swoosh', createdAt: now },
      ],
    },
  ];
  saveProjects(sample);
}

export function createProject(name: string): Project {
  const projects = getProjects();
  const p: Project = { id: uid(), name, createdAt: Date.now(), assets: [] };
  projects.unshift(p);
  saveProjects(projects);
  return p;
}

export function renameProject(id: string, name: string) {
  const projects = getProjects().map(p => (p.id === id ? { ...p, name } : p));
  saveProjects(projects);
}

export function deleteProject(id: string) {
  const projects = getProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

export function addAsset(projectId: string, asset: Asset) {
  const projects = getProjects().map(p => (p.id === projectId ? { ...p, assets: [asset, ...p.assets] } : p));
  saveProjects(projects);
}

export function removeAsset(projectId: string, assetId: string) {
  const projects = getProjects().map(p => (p.id === projectId ? { ...p, assets: p.assets.filter(a => a.id !== assetId) } : p));
  saveProjects(projects);
}
