import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Edit3, 
  Download,
  Upload,
  Globe,
  Image as ImageIcon,
  Video,
  Play,
  RotateCcw,
  Eye,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import { aiService } from '@/lib/ai-service';

const AdCreator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [adData, setAdData] = useState({
    platform: '',
    videoType: '',
    input: '',
    url: '',
    inputType: 'text' as 'text' | 'url',
    language: 'en',
    scripts: [] as string[],
    selectedScript: '',
    customScript: '',
    images: [] as string[],
    videos: [] as string[],
    productInfo: null as {images: string[], title: string, description: string, price?: string, category?: string} | null,
    productAdType: '',
    selectedAssets: {
      image: '',
      video: ''
    }
  });
  
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Platform', description: 'Choose your target platform' },
    { id: 2, title: 'Video Type', description: 'Select video content type' },
    { id: 3, title: 'Input', description: 'Provide content details' },
    { id: 4, title: 'Script', description: 'AI-generated scripts & concepts' },
    { id: 5, title: 'Create Video', description: 'Generate your video ad' }
  ];

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: '📘', description: 'Social media posts and stories' },
    { id: 'youtube', name: 'YouTube', icon: '📺', description: 'Video ads and shorts' },
    { id: 'instagram', name: 'Instagram', icon: '📷', description: 'Stories, reels, and posts' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', description: 'Promoted tweets and videos' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', description: 'Professional video content' }
  ];

  const videoTypes = [
    { id: 'product-ad', name: 'Product Ad', icon: '🛍️', description: 'Showcase products with external assets', requiresUrl: true },
    { id: 'avatar-video', name: 'Avatar Video', icon: '👤', description: 'AI-generated avatar presenting content', requiresUrl: false },
    { id: 'character-vlog', name: 'Character Vlog', icon: '🎭', description: 'Animated character sharing insights', requiresUrl: false },
    { id: 'normal-video', name: 'Normal Video', icon: '🎬', description: 'Standard promotional video content', requiresUrl: false },
    { id: 'tutorial', name: 'Tutorial', icon: '📚', description: 'Educational how-to content', requiresUrl: false },
    { id: 'testimonial', name: 'Testimonial', icon: '💬', description: 'Customer review and feedback', requiresUrl: false }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ];

  const sampleScripts = [
    "Transform your style with our revolutionary AI-powered fashion assistant. Discover looks that match your personality perfectly. Shop smarter, look better, feel confident. Your perfect outfit is just one click away!",
    "Experience the future of shopping today! Our AI curates personalized recommendations just for you. Say goodbye to endless scrolling and hello to your new favorite finds. Download now and transform your wardrobe!",
    "Ready to revolutionize your style? Join thousands who've discovered their signature look with our smart fashion AI. Personalized, affordable, and always on-trend. Your style journey starts here!"
  ];

  const sampleImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop"
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      toast.success(`Moved to ${steps[currentStep].title}`);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateScripts = async () => {
    setLoading(true);
    try {
      const selectedPlatform = platforms.find(p => p.id === adData.platform)?.name || 'social media';
      const selectedVideoType = videoTypes.find(t => t.id === adData.videoType)?.name || 'video';
      const selectedLanguage = languages.find(l => l.code === adData.language)?.name || 'English';
      
      console.log('🎬 Generating scripts with:', {
        platform: selectedPlatform,
        videoType: selectedVideoType,
        language: selectedLanguage,
        isProductAd: adData.videoType === 'product-ad'
      });

      let scripts: string[];

      if (adData.videoType === 'product-ad' && adData.url) {
        // For product ads, first scrape product info, then generate product-specific scripts
        toast.info('Scraping product information...');
        const productInfo = await aiService.scrapeProductInfo(adData.url);
        
        setAdData(prev => ({ 
          ...prev, 
          productInfo,
          images: productInfo.images 
        }));
        
        toast.info('Generating product-specific scripts...');
        scripts = await aiService.generateProductScript(
          productInfo,
          selectedPlatform,
          selectedLanguage
        );
      } else {
        // For other video types, use regular script generation
        const inputText = adData.input || adData.url || 'Create an engaging video';
        scripts = await aiService.generateScript(
          inputText,
          selectedPlatform,
          selectedVideoType,
          selectedLanguage
        );
      }
      
      setAdData(prev => ({ ...prev, scripts }));
      toast.success('AI scripts generated successfully!');
    } catch (error) {
      console.error('Script generation error:', error);
      toast.error('Failed to generate scripts. Please try again.');
      // Fallback to sample scripts
      setAdData(prev => ({ ...prev, scripts: sampleScripts }));
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateScripts = () => {
    handleGenerateScripts();
    toast.info('Regenerating scripts with fresh AI perspectives...');
  };

  const getSelectedVideoType = () => {
    return videoTypes.find(type => type.id === adData.videoType);
  };

  const handleCreateVideo = async () => {
    if (!adData.selectedScript) {
      toast.error('Please select a script first');
      return;
    }

    setLoading(true);
    try {
      const selectedVideoType = videoTypes.find(t => t.id === adData.videoType);
      
      // All video types now use Veo3 Fast for 8-second video generation
      const useVeo3 = true; // All video types now use Veo3 Fast
      
      if (useVeo3) {
        console.log('🎬 Creating 8-second video with KIE AI Veo3 Fast...');
        
        // Validate and correct spelling in the script first
        const correctedScript = await aiService.validateScriptSpelling(adData.selectedScript);
        console.log('📝 Using corrected script:', correctedScript);
        
        // Create a video prompt based on the script and video type
        const videoPrompt = `Create a ${selectedVideoType?.name.toLowerCase()} video: ${correctedScript}`;
        
        // Use Veo3 Fast for 8-second video generation
        const videoUrl = await aiService.generateVeo3FastVideo(videoPrompt);
        
        console.log('✅ Video generated:', videoUrl);
        toast.success('8-second video ad created successfully!');
        
        // Store the video URL in the ad data
        setAdData(prev => ({ 
          ...prev, 
          videos: [...prev.videos, videoUrl],
          selectedAssets: { ...prev.selectedAssets, video: videoUrl }
        }));
        
        toast.success('8-second video generated! Check the preview panel to see your video.');
      }
      
    } catch (error) {
      console.error('Video creation error:', error);
      toast.error('Failed to create video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVisuals = async (type: 'image' | 'video') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (type === 'image') {
        setAdData(prev => ({ ...prev, images: sampleImages }));
        toast.success('AI images generated successfully!');
      } else {
        setAdData(prev => ({ ...prev, videos: ['sample-video-1', 'sample-video-2'] }));
        toast.success('AI videos generated successfully!');
      }
    } catch (error) {
      toast.error(`Failed to generate ${type}s. Please try again.`);
    } finally {
      setLoading(false);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 gradient-text">Choose Your Platform</h2>
              <p className="text-muted-foreground">Select where you want to publish your video ad</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <Card
                  key={platform.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    adData.platform === platform.id
                      ? 'border-primary bg-primary/10 glow-box'
                      : 'bg-card/50 hover:bg-card/80'
                  }`}
                  onClick={() => setAdData(prev => ({ ...prev, platform: platform.id }))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{platform.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 gradient-text">Select Video Type</h2>
              <p className="text-muted-foreground">Choose the type of video content you want to create</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    adData.videoType === type.id
                      ? 'border-primary bg-primary/10 glow-box'
                      : 'bg-card/50 hover:bg-card/80'
                  }`}
                  onClick={() => setAdData(prev => ({ ...prev, videoType: type.id }))}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{type.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                        {type.requiresUrl && (
                          <Badge variant="secondary" className="mt-2">Requires Product URL</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        const selectedVideoType = getSelectedVideoType();
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 gradient-text">Content Details</h2>
              <p className="text-muted-foreground">
                {selectedVideoType?.requiresUrl 
                  ? 'Provide the product URL and additional details'
                  : 'Describe your video content and requirements'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <Select
                  value={adData.language}
                  onValueChange={(value) => setAdData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedVideoType?.requiresUrl ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Product URL</label>
                  <Input
                    placeholder="https://example.com/product"
                    value={adData.url}
                    onChange={(e) => setAdData(prev => ({ ...prev, url: e.target.value }))}
                    className="bg-card border-border focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll extract product information from this URL
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Video Description</label>
                  <Textarea
                    placeholder="Describe your video content, target audience, key messages, and any specific requirements..."
                    value={adData.input}
                    onChange={(e) => setAdData(prev => ({ ...prev, input: e.target.value }))}
                    rows={6}
                    className="bg-card border-border focus:border-primary resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 gradient-text">AI-Generated Scripts</h2>
              <p className="text-muted-foreground">Review and customize your ad scripts</p>
            </div>

            {adData.scripts.length === 0 ? (
              <div className="text-center py-12">
                <Wand2 className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
                <p className="text-muted-foreground mb-6">Ready to generate your AI-powered scripts?</p>
                <Button
                  onClick={handleGenerateScripts}
                  disabled={loading}
                  variant="neon"
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Generating Scripts...' : 'Generate AI Scripts'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Generated Scripts</h3>
                  <Button
                    onClick={handleRegenerateScripts}
                    disabled={loading}
                    variant="neon-outline"
                    size="sm"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </Button>
                </div>

                <div className="grid gap-4">
                  {adData.scripts.map((script, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-300 ${
                        adData.selectedScript === script
                          ? 'border-primary bg-primary/10 glow-box'
                          : 'bg-card/50 hover:bg-card/80'
                      }`}
                      onClick={() => setAdData(prev => ({ ...prev, selectedScript: script }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">Script {index + 1}</Badge>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm leading-relaxed">{script}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Product Images Selection for Product Ads */}
                {adData.videoType === 'product-ad' && adData.productInfo && adData.productInfo.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Select Product Image for Video</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {adData.productInfo.images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                            adData.selectedAssets.image === image
                              ? 'ring-2 ring-primary glow-box'
                              : 'hover:scale-105'
                          }`}
                          onClick={() => setAdData(prev => ({
                            ...prev,
                            selectedAssets: { ...prev.selectedAssets, image }
                          }))}
                        >
                          <img
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                            Product Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select an image to use for video generation
                    </p>
                  </div>
                )}

                {/* Product Ad Type Selection */}
                {adData.videoType === 'product-ad' && adData.productInfo && (
                  <div>
                    <h3 className="font-semibold mb-3">Choose Ad Style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiService.getProductAdTypes().map((adType) => (
                        <Card
                          key={adType.id}
                          className={`cursor-pointer transition-all duration-300 ${
                            adData.productAdType === adType.id
                              ? 'border-primary bg-primary/10 glow-box'
                              : 'bg-card/50 hover:bg-card/80'
                          }`}
                          onClick={() => setAdData(prev => ({ ...prev, productAdType: adType.id }))}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{adType.icon}</div>
                              <div>
                                <h4 className="font-semibold">{adType.name}</h4>
                                <p className="text-xs text-muted-foreground">{adType.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select the style for your product video
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Custom Script (Optional)</label>
                  <Textarea
                    placeholder="Write your own custom script or modify the generated ones..."
                    value={adData.customScript}
                    onChange={(e) => setAdData(prev => ({ ...prev, customScript: e.target.value }))}
                    rows={4}
                    className="bg-card border-border focus:border-primary resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 gradient-text">Create Your Video Ad</h2>
              <p className="text-muted-foreground">Generate your final video ad with AI</p>
            </div>

            <div className="bg-card/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Video Summary</h3>
                  <p className="text-sm text-muted-foreground">Review your selections before creating</p>
                    </div>
                <Badge variant="secondary">
                  {platforms.find(p => p.id === adData.platform)?.name} • {videoTypes.find(t => t.id === adData.videoType)?.name}
                </Badge>
                          </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Platform:</span>
                  <span className="ml-2">{platforms.find(p => p.id === adData.platform)?.name}</span>
                </div>
                <div>
                  <span className="font-medium">Video Type:</span>
                  <span className="ml-2">{videoTypes.find(t => t.id === adData.videoType)?.name}</span>
                </div>
                <div>
                  <span className="font-medium">Language:</span>
                  <span className="ml-2">{languages.find(l => l.code === adData.language)?.name}</span>
                </div>
                <div>
                  <span className="font-medium">Script:</span>
                  <span className="ml-2">{adData.selectedScript ? 'Selected' : 'Not selected'}</span>
                </div>
                {adData.videoType === 'product-ad' && adData.productInfo && (
                  <>
                    <div>
                      <span className="font-medium">Product:</span>
                      <span className="ml-2">{adData.productInfo.title}</span>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <span className="ml-2">{adData.productInfo.price || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Product Image:</span>
                      <span className="ml-2">{adData.selectedAssets.image ? 'Selected' : 'Not selected'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Ad Style:</span>
                      <span className="ml-2">{adData.productAdType ? aiService.getProductAdTypes().find(t => t.id === adData.productAdType)?.name : 'Not selected'}</span>
                    </div>
                  </>
                )}
              </div>

              {adData.selectedScript && (
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Script Preview</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {adData.selectedScript.substring(0, 200)}...
                  </p>
                    </div>
                  )}
            </div>

            <div className="text-center">
              {!adData.selectedAssets.video ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleCreateVideo}
                    disabled={loading || !adData.selectedScript || (adData.videoType === 'product-ad' && (!adData.selectedAssets.image || !adData.productAdType))}
                    variant="neon"
                    size="lg"
                    className="w-full max-w-md"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Creating 8-Second Video...' : 'Create 8-Second Video Ad'}
                  </Button>
                  
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden border border-border">
                    <video
                      src={adData.selectedAssets.video}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => window.location.href = '/gallery'}
                      variant="neon"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save to Gallery
                    </Button>
                    <Button
                      variant="neon-outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = adData.selectedAssets.video;
                        link.download = 'generated-video.mp4';
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
              {!adData.selectedScript && !adData.selectedAssets.video && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please select a script in the previous step
                </p>
              )}
              {adData.videoType === 'product-ad' && !adData.selectedAssets.image && adData.selectedScript && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please select a product image in the previous step
                </p>
              )}
              {adData.videoType === 'product-ad' && !adData.productAdType && adData.selectedScript && adData.selectedAssets.image && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please select an ad style in the previous step
                </p>
              )}
            </div>
          </div>
        );


      default:
        return null;
    }
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
                <h1 className="text-xl font-bold gradient-text">Sparkwave Wizard</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                </p>
              </div>
            </div>
            <Button variant="neon-outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <Progress value={(currentStep / 5) * 100} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      currentStep === step.id
                        ? 'bg-primary/20 border border-primary text-primary'
                        : currentStep > step.id
                        ? 'bg-muted/50 text-muted-foreground'
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        currentStep === step.id
                          ? 'bg-primary text-primary-foreground glow-box'
                          : currentStep > step.id
                          ? 'bg-primary/30 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.id}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-card/30 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="neon-outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === 5}
                variant="neon"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview Content */}
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  {adData.selectedAssets.video ? (
                    <video
                      src={adData.selectedAssets.video}
                      controls
                      className="w-full h-full object-cover rounded-lg"
                      poster=""
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : adData.selectedAssets.image ? (
                    <img
                      src={adData.selectedAssets.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Eye className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Preview will appear here</p>
                    </div>
                  )}
                </div>

                {/* Selected Script Preview */}
                {adData.selectedScript && (
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Script</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {adData.selectedScript.substring(0, 120)}...
                    </p>
                  </div>
                )}

                {/* Platform & Video Type Info */}
                {adData.platform && (
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Selected Platform</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{platforms.find(p => p.id === adData.platform)?.icon}</span>
                      <span className="text-sm">{platforms.find(p => p.id === adData.platform)?.name}</span>
                    </div>
                  </div>
                )}

                {adData.videoType && (
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Video Type</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{videoTypes.find(t => t.id === adData.videoType)?.icon}</span>
                      <span className="text-sm">{videoTypes.find(t => t.id === adData.videoType)?.name}</span>
                    </div>
                  </div>
                )}

                {currentStep === 5 && adData.selectedScript && (
                  <div className="space-y-3">
                    {!adData.selectedAssets.video ? (
                      <Button 
                        variant="neon" 
                        className="w-full"
                        onClick={handleCreateVideo}
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {loading ? 'Creating...' : 'Create Video'}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          variant="neon" 
                          className="w-full"
                          onClick={() => window.location.href = '/gallery'}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Save to Gallery
                        </Button>
                        <Button 
                          variant="neon-outline" 
                          className="w-full"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = adData.selectedAssets.video;
                            link.download = 'generated-video.mp4';
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdCreator;