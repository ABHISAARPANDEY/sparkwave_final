import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Edit3,
  Eye,
  Play,
  Pause,
  Image as ImageIcon,
  Video,
  FileText,
  User,
  Mic,
  Calendar,
  Clock,
  Heart,
  Share2,
  MoreVertical,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// Import sample assets
import carExampleImage from '@/assets/ad-example-car.jpg';
import handbagExampleImage from '@/assets/ad-example-handbag.jpg';
import sneakersExampleImage from '@/assets/ad-example-sneakers.jpg';

type AssetType = 'all' | 'image' | 'video' | 'script' | 'avatar' | 'audio';
type ViewMode = 'grid' | 'list';

interface AssetItem {
  id: string;
  title: string;
  type: AssetType;
  thumbnail?: string;
  duration?: string;
  size?: string;
  createdAt: string;
  downloads: number;
  likes: number;
  description: string;
  tags: string[];
  script?: string;
}

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState<AssetType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample data - in a real app this would come from an API
  const assets: AssetItem[] = [
    {
      id: '1',
      title: 'Neon Car Dreamscape',
      type: 'image',
      thumbnail: carExampleImage,
      size: '1920x1080',
      createdAt: '2024-01-15T10:30:00Z',
      downloads: 245,
      likes: 89,
      description: 'Futuristic sports car in cyberpunk neon cityscape with electric blue and pink lighting',
      tags: ['automotive', 'neon', 'cyberpunk', 'futuristic']
    },
    {
      id: '2',
      title: 'Luxury Handbag Campaign',
      type: 'video',
      thumbnail: handbagExampleImage,
      duration: '0:30',
      size: '1080p',
      createdAt: '2024-01-14T14:20:00Z',
      downloads: 156,
      likes: 67,
      description: 'Elegant luxury handbag floating in neon-lit fashion runway',
      tags: ['fashion', 'luxury', 'runway', 'elegant']
    },
    {
      id: '3',
      title: 'Sky-High Kicks Promo',
      type: 'image',
      thumbnail: sneakersExampleImage,
      size: '1080x1080',
      createdAt: '2024-01-13T09:15:00Z',
      downloads: 198,
      likes: 124,
      description: 'Futuristic sneakers with electric energy trails and holographic effects',
      tags: ['sports', 'sneakers', 'futuristic', 'energy']
    },
    {
      id: '4',
      title: 'Tech Product Launch Script',
      type: 'script',
      createdAt: '2024-01-12T16:45:00Z',
      downloads: 78,
      likes: 34,
      description: 'AI-generated script for revolutionary tech product announcement',
      tags: ['technology', 'product-launch', 'innovation'],
      script: 'Revolutionize your daily routine with cutting-edge technology that adapts to your lifestyle. Experience innovation like never before – smart, intuitive, and designed for the future. Join the revolution today!'
    },
    {
      id: '5',
      title: 'AI Avatar Presenter',
      type: 'avatar',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      duration: '1:15',
      size: '4K',
      createdAt: '2024-01-11T11:30:00Z',
      downloads: 89,
      likes: 56,
      description: 'Professional AI avatar delivering product presentation with lip sync',
      tags: ['avatar', 'presentation', 'professional', 'ai-generated']
    },
    {
      id: '6',
      title: 'Epic Sound Effects Pack',
      type: 'audio',
      duration: '2:30',
      size: '96kHz',
      createdAt: '2024-01-10T13:20:00Z',
      downloads: 167,
      likes: 92,
      description: 'Dynamic sound effects collection for high-impact advertisements',
      tags: ['sound-effects', 'epic', 'dramatic', 'impact']
    },
    {
      id: '7',
      title: 'Fitness Motivation Video',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      duration: '0:45',
      size: '1080p',
      createdAt: '2024-01-09T08:10:00Z',
      downloads: 223,
      likes: 145,
      description: 'High-energy fitness motivation video with dynamic transitions',
      tags: ['fitness', 'motivation', 'energy', 'workout']
    },
    {
      id: '8',
      title: 'Brand Voice-over',
      type: 'audio',
      duration: '1:00',
      size: '48kHz',
      createdAt: '2024-01-08T15:40:00Z',
      downloads: 134,
      likes: 78,
      description: 'Professional brand voice-over with emotional impact',
      tags: ['voice-over', 'brand', 'professional', 'emotional']
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Assets', icon: Grid3X3, count: assets.length },
    { value: 'image', label: 'Images', icon: ImageIcon, count: assets.filter(a => a.type === 'image').length },
    { value: 'video', label: 'Videos', icon: Video, count: assets.filter(a => a.type === 'video').length },
    { value: 'script', label: 'Scripts', icon: FileText, count: assets.filter(a => a.type === 'script').length },
    { value: 'avatar', label: 'Avatar Videos', icon: User, count: assets.filter(a => a.type === 'avatar').length },
    { value: 'audio', label: 'Audio', icon: Mic, count: assets.filter(a => a.type === 'audio').length }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesFilter = selectedFilter === 'all' || asset.type === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (asset: AssetItem) => {
    toast.success(`Downloading ${asset.title}...`);
    // In a real app, this would trigger an actual download
  };

  const handleEdit = (asset: AssetItem) => {
    toast.info(`Opening ${asset.title} in editor...`);
    // In a real app, this would navigate to an editor
  };

  const handleView = (asset: AssetItem) => {
    toast.info(`Viewing ${asset.title} details...`);
    // In a real app, this would open a detailed view modal
  };

  const toggleLike = (assetId: string) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(assetId)) {
      newLikedItems.delete(assetId);
    } else {
      newLikedItems.add(assetId);
    }
    setLikedItems(newLikedItems);
  };

  const toggleAudioPlayback = (assetId: string) => {
    if (playingAudio === assetId) {
      setPlayingAudio(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingAudio(assetId);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAssetIcon = (type: AssetType) => {
    const iconMap = {
      image: ImageIcon,
      video: Video,
      script: FileText,
      avatar: User,
      audio: Mic,
      all: Grid3X3
    };
    return iconMap[type] || Grid3X3;
  };

  const renderAssetCard = (asset: AssetItem) => {
    const IconComponent = getAssetIcon(asset.type);
    const isLiked = likedItems.has(asset.id);
    const isPlaying = playingAudio === asset.id;

    return (
      <Card key={asset.id} className="group bg-card/50 backdrop-blur-sm border-border/50 hover-lift hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <div className="relative">
          {/* Thumbnail or Icon */}
          <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center relative overflow-hidden">
            {asset.thumbnail ? (
              <img 
                src={asset.thumbnail} 
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : asset.type === 'script' ? (
              <div className="w-full h-full p-4 flex flex-col justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                <FileText className="w-8 h-8 text-primary mb-2" />
                <p className="text-xs text-foreground/80 line-clamp-3 leading-relaxed">
                  {asset.script?.substring(0, 120)}...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <IconComponent className="w-12 h-12 text-primary" />
                <Badge variant="secondary" className="text-xs">
                  {asset.type.toUpperCase()}
                </Badge>
              </div>
            )}

            {/* Overlay with quick actions */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
              <Button 
                variant="neon-outline" 
                size="sm"
                onClick={() => handleView(asset)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="neon-outline" 
                size="sm"
                onClick={() => handleEdit(asset)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button 
                variant="neon-outline" 
                size="sm"
                onClick={() => handleDownload(asset)}
              >
                <Download className="w-4 h-4" />
              </Button>
              {(asset.type === 'audio' || asset.type === 'video' || asset.type === 'avatar') && (
                <Button 
                  variant="neon" 
                  size="sm"
                  onClick={() => toggleAudioPlayback(asset.id)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {/* Type badge */}
            <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground">
              <IconComponent className="w-3 h-3 mr-1" />
              {asset.type}
            </Badge>

            {/* Duration badge for media assets */}
            {asset.duration && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                <Clock className="w-3 h-3 mr-1" />
                {asset.duration}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {asset.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {asset.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {asset.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{asset.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(asset.createdAt)}
                </div>
                {asset.size && (
                  <div className="flex items-center gap-1">
                    <Grid3X3 className="w-3 h-3" />
                    {asset.size}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  className={`flex items-center gap-1 hover:text-primary transition-colors ${isLiked ? 'text-red-500' : ''}`}
                  onClick={() => toggleLike(asset.id)}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                  {asset.likes + (isLiked ? 1 : 0)}
                </button>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {asset.downloads}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="neon-outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleView(asset)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDownload(asset)}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Asset Gallery</h1>
                <p className="text-sm text-muted-foreground">
                  Browse and manage your AI-generated ad assets
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="neon-outline" 
                size="sm"
                onClick={() => window.location.href = '/ad-creator'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create New
              </Button>
              
              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'neon' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'neon' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Search Assets</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by title, description, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background/50"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Asset Type
                    </label>
                    <div className="space-y-2">
                      {filterOptions.map(option => {
                        const IconComponent = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => setSelectedFilter(option.value as AssetType)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                              selectedFilter === option.value
                                ? 'bg-primary/20 border border-primary text-primary'
                                : 'hover:bg-muted/50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-4 h-4" />
                              <span className="text-sm font-medium">{option.label}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {option.count}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                    <h3 className="font-medium mb-2">Gallery Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Assets</span>
                        <span className="font-medium">{assets.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Downloads</span>
                        <span className="font-medium">
                          {assets.reduce((sum, asset) => sum + asset.downloads, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Likes</span>
                        <span className="font-medium">
                          {assets.reduce((sum, asset) => sum + asset.likes, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assets Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  {filteredAssets.length} {filteredAssets.length === 1 ? 'Asset' : 'Assets'}
                  {selectedFilter !== 'all' && (
                    <span className="text-muted-foreground"> in {selectedFilter}</span>
                  )}
                </h2>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Searching for "{searchQuery}"
                  </p>
                )}
              </div>
              
              <select className="px-3 py-2 bg-card border border-border rounded-lg text-sm">
                <option>Sort by Date</option>
                <option>Sort by Downloads</option>
                <option>Sort by Likes</option>
                <option>Sort by Name</option>
              </select>
            </div>

            {/* Assets Grid/List */}
            {filteredAssets.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No assets found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No assets match "${searchQuery}". Try a different search term.`
                    : `No ${selectedFilter === 'all' ? '' : selectedFilter} assets available yet.`
                  }
                </p>
                <Button 
                  variant="neon-outline"
                  onClick={() => window.location.href = '/ad-creator'}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Your First Asset
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredAssets.map(renderAssetCard)}
              </div>
            )}
          </div>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
};

export default Gallery;