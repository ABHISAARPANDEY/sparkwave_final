import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { addAsset, Asset, AssetType, createProject, deleteProject, getProjects, Project, removeAsset, renameProject, seedProjectsIfEmpty, uid } from '@/lib/storage';
import { Download, Edit3, LogOut, Plus, Trash2, Image as ImageIcon, FileText, Video, Mic, UserSquare2 } from 'lucide-react';

const typeLabels: Record<AssetType, string> = {
  image: 'Images',
  video: 'Videos',
  script: 'Scripts',
  avatar: 'Avatars',
  audio: 'Audio'
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<AssetType>('image');
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    document.title = 'Dashboard – Hypergro AI';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Manage your AI ad projects: scripts, images, videos, avatars, and audio.');
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = 'Manage your AI ad projects: scripts, images, videos, avatars, and audio.';
      document.head.appendChild(m);
    }
    const link = document.querySelector('link[rel=canonical]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.origin + '/dashboard');
    if (!link.parentElement) document.head.appendChild(link);
  }, []);

  useEffect(() => {
    seedProjectsIfEmpty();
    setProjects(getProjects());
  }, []);

  const countsByType = useMemo(() => {
    const counts: Record<AssetType, number> = { image: 0, video: 0, script: 0, avatar: 0, audio: 0 };
    projects.forEach(p => p.assets.forEach(a => { counts[a.type]++; }));
    return counts;
  }, [projects]);

  const refresh = () => setProjects(getProjects());

  const handleNewProject = () => {
    const p = createProject(`Project ${projects.length + 1}`);
    setProjects([p, ...projects]);
  };

  const handleRename = () => {
    if (!renaming) return;
    renameProject(renaming.id, renaming.name.trim() || 'Untitled Project');
    setRenaming(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    refresh();
  };

  const handleAddSampleAsset = (projectId: string, type: AssetType) => {
    const sample: Asset = {
      id: uid(),
      type,
      title: `Sample ${type}`,
      createdAt: Date.now(),
      ...(type === 'image' ? { src: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800' } : {}),
      ...(type === 'script' ? { content: 'Sample script: Your product, amplified with AI.' } : {}),
    };
    addAsset(projectId, sample);
    refresh();
  };

  const downloadAsset = (asset: Asset) => {
    if (asset.type === 'script' && asset.content) {
      const blob = new Blob([asset.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${asset.title || 'script'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    if ((asset.type === 'image' || asset.type === 'video' || asset.type === 'audio') && asset.src) {
      const a = document.createElement('a');
      a.href = asset.src;
      a.download = asset.title || `${asset.type}`;
      a.target = '_blank';
      a.click();
      return;
    }
    const blob = new Blob([JSON.stringify(asset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title || 'asset'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAssets = (p: Project, type: AssetType) => p.assets.filter(a => a.type === type);

  const Icon = ({ t }: { t: AssetType }) => {
    const map = { image: ImageIcon, video: Video, script: FileText, avatar: UserSquare2, audio: Mic };
    const I = map[t];
    return <I className="w-4 h-4" />;
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Your Dashboard</h1>
            <p className="text-sm text-muted-foreground">Organize scripts, images, videos, avatars, and audio</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="neon-outline" onClick={() => navigate('/ad-creator')}>
              <Edit3 className="w-4 h-4 mr-2" />Create Ad
            </Button>
            <Button variant="ghost" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="w-4 h-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(typeLabels) as AssetType[]).map((t) => (
              <Badge key={t} className="bg-primary/15 text-primary border-primary/30">
                <Icon t={t} />
                <span className="ml-2">{typeLabels[t]}</span>
                <span className="ml-2 opacity-70">{countsByType[t]}</span>
              </Badge>
            ))}
          </div>
          <Button variant="neon" onClick={handleNewProject}><Plus className="w-4 h-4 mr-2" />New Project</Button>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AssetType)}>
          <TabsList className="mb-6">
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="script">Scripts</TabsTrigger>
            <TabsTrigger value="avatar">Avatars</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          {(Object.keys(typeLabels) as AssetType[]).map((t) => (
            <TabsContent key={t} value={t} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => {
                  const assets = filteredAssets(p, t);
                  return (
                    <Card key={p.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{p.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setRenaming({ id: p.id, name: p.name })}><Edit3 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {assets.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">
                            No {typeLabels[t]} yet.
                            <div className="mt-3">
                              <Button variant="neon-outline" size="sm" onClick={() => handleAddSampleAsset(p.id, t)}>Add Sample</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Previews */}
                            {t === 'image' && (
                              <div className="grid grid-cols-3 gap-2">
                                {assets.slice(0,3).map(a => (
                                  <img key={a.id} src={a.src} alt={a.title} className="w-full h-24 object-cover rounded" loading="lazy" />
                                ))}
                              </div>
                            )}
                            {t === 'script' && (
                              <div className="space-y-2">
                                {assets.slice(0,3).map(a => (
                                  <div key={a.id} className="p-3 text-sm rounded border border-border/50 bg-muted/20 line-clamp-3">{a.content}</div>
                                ))}
                              </div>
                            )}
                            {t !== 'image' && t !== 'script' && (
                              <div className="text-sm text-muted-foreground">{assets.length} {typeLabels[t]} available.</div>
                            )}

                            {/* Asset Actions */}
                            <div className="flex flex-wrap gap-2">
                              {assets.slice(0,3).map(a => (
                                <Button key={a.id} variant="ghost" size="sm" onClick={() => downloadAsset(a)}>
                                  <Download className="w-4 h-4 mr-1" />{a.title}
                                </Button>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <Button variant="neon-outline" size="sm" onClick={() => navigate('/ad-creator')}>Edit in Creator</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleAddSampleAsset(p.id, t)}>Add More</Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <Input value={renaming?.name || ''} onChange={(e) => setRenaming(r => r ? { ...r, name: e.target.value } : r)} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button>
            <Button variant="neon" onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Dashboard;
