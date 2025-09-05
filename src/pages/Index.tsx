import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Video, 
  Image, 
  Globe, 
  MessageSquare, 
  Mic, 
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  ArrowRight,
  Play
} from 'lucide-react';

import heroImage from '@/assets/hero-ai-ads.jpg';
import carExampleImage from '@/assets/ad-example-car.jpg';
import handbagExampleImage from '@/assets/ad-example-handbag.jpg';
import sneakersExampleImage from '@/assets/ad-example-sneakers.jpg';

const Index = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const features = [
    { icon: FileText, title: 'Text to Ads', description: 'Convert your ideas into stunning advertisements instantly' },
    { icon: Globe, title: 'URL to Ads', description: 'Generate ads from any website or product page' },
    { icon: MessageSquare, title: 'Script Generation', description: 'AI-powered scripts for engaging ad content' },
    { icon: Image, title: 'Image Generation', description: 'Create and modify images with AI precision' },
    { icon: Video, title: 'Video Generation', description: 'Professional videos with lip sync technology' },
    { icon: Mic, title: 'Sound Effects', description: 'Custom audio and sound effects generation' },
    { icon: Play, title: 'Image to Video', description: 'Transform static images into dynamic videos' },
    { icon: Zap, title: 'Avatar Videos', description: 'Realistic avatar-based video creation' },
  ];

  const adExamples = [
    { 
      title: 'Neon Car Dreamscape',
      image: carExampleImage,
      category: 'Automotive'
    },
    { 
      title: 'Handbag Runway',
      image: handbagExampleImage,
      category: 'Fashion'
    },
    { 
      title: 'Sky-High Kicks',
      image: sneakersExampleImage,
      category: 'Sports'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechFlow Inc.',
      content: 'This AI ad maker revolutionized our marketing campaigns. The quality and speed are unmatched.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      company: 'Brand Studio',
      content: 'Incredible results in minutes, not hours. Our clients are amazed by the professional quality.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'E-commerce Manager',
      company: 'StyleCart',
      content: 'Multi-language support helped us reach global audiences effortlessly. Game-changer!',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'How does the AI ad generation work?',
      answer: 'Our advanced AI analyzes your input (text, URL, or images) and creates professional advertisements using machine learning models trained on millions of high-converting ads.'
    },
    {
      question: 'Can I customize the generated ads?',
      answer: 'Absolutely! You can modify colors, text, images, and layout. Our AI provides a starting point that you can refine to match your brand perfectly.'
    },
    {
      question: 'What formats are supported for output?',
      answer: 'We support video (MP4, WebM), image (PNG, JPEG), and audio (MP3, WAV) formats. All outputs are optimized for different platforms including social media, web, and print.'
    },
    {
      question: 'Is there multi-language support?',
      answer: 'Yes! Our AI supports over 50 languages and can generate ads in multiple languages simultaneously, helping you reach global audiences.'
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 animate-pulse-slow">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Ad Creation
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Create <span className="gradient-text glow-text">Stunning Ads</span>
            <br />
            in Seconds with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into professional advertisements instantly. From text to video, 
            our AI handles everything with multi-language support and cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="hero" 
              size="xl" 
              className="animate-float"
              onClick={() => window.location.href = '/ad-creator'}
            >
              <Zap className="w-6 h-6 mr-3" />
              Generate an Ad for Me
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            
            <Button variant="neon-outline" size="xl" className="animate-pulse-slow">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
              Multi-Language Support
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full animate-ping" />
              Real-time Generation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-ping" />
              Professional Quality
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Powerful <span className="gradient-text">AI Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional advertisements with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover-lift group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:animate-glow">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Examples Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Vibrant <span className="gradient-text">Ad Examples</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See the quality and creativity our AI delivers across different industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {adExamples.map((example, index) => (
              <Card key={index} className="bg-card/30 backdrop-blur-sm border-border/50 hover-scale group overflow-hidden">
                <div className="relative">
                  <img 
                    src={example.image} 
                    alt={example.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-neon-cyan text-background">
                    {example.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
                  <Button variant="neon-outline" size="sm" className="w-full">
                    Generate Similar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-card to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Real results from real customers transforming their advertising
            </p>
            <Button 
              variant="neon-outline"
              onClick={() => window.location.href = '/testimonials'}
            >
              <Users className="w-4 h-4 mr-2" />
              View All Success Stories
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/20 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Create <span className="gradient-text">Amazing Ads</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of creators who are already using AI to revolutionize their advertising
          </p>
          
          <Button 
            variant="hero" 
            size="xl" 
            className="animate-glow"
            onClick={() => window.location.href = '/ad-creator'}
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Start Creating Now
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          <div className="mt-8 flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              50K+ Users
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              1M+ Ads Created
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-card border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 gradient-text">AI Ad Maker</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Transform your advertising with cutting-edge AI technology. Create stunning ads in seconds, 
                not hours.
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="neon-outline" 
                  size="sm"
                  onClick={() => window.location.href = '/gallery'}
                >
                  Browse Gallery
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/ad-creator'}
                >
                  Start Creating
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/ad-creator" className="hover:text-primary transition-colors">Text to Ads</a></li>
                <li><a href="/ad-creator" className="hover:text-primary transition-colors">URL to Ads</a></li>
                <li><a href="/ad-creator" className="hover:text-primary transition-colors">Video Generation</a></li>
                <li><a href="/gallery" className="hover:text-primary transition-colors">Asset Gallery</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/testimonials" className="hover:text-primary transition-colors">Success Stories</a></li>
                <li><a href="/gallery" className="hover:text-primary transition-colors">Browse Gallery</a></li>
                <li><a href="/ad-creator" className="hover:text-primary transition-colors">Create New</a></li>
                <li><a href="/testimonials" className="hover:text-primary transition-colors">Case Studies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-muted-foreground">
            <p>&copy; 2024 AI Ad Maker. All rights reserved. Built with cutting-edge AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;