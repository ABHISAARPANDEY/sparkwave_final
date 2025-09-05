import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Star,
  Quote,
  Users,
  TrendingUp,
  Zap,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  category: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  videoUrl?: string;
  featured: boolean;
  industry: string;
  companySize: string;
}

const Testimonials = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechFlow Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      quote: 'AI Ad Maker completely revolutionized our marketing campaigns. We went from spending weeks on ad creation to generating professional content in minutes. Our conversion rates increased by 340% and our creative production costs dropped by 85%. The quality is simply unmatched.',
      rating: 5,
      category: 'Enterprise',
      results: [
        { metric: 'Conversion Rate', value: '340%', improvement: 'increase' },
        { metric: 'Production Cost', value: '85%', improvement: 'reduction' },
        { metric: 'Time to Market', value: '92%', improvement: 'faster' }
      ],
      featured: true,
      industry: 'Technology',
      companySize: '500-1000'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Creative Director',
      company: 'Brand Studio',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      quote: 'The AI-generated content quality is incredible. Our clients are amazed by the professional results we deliver in record time. The multi-language support helped us expand globally, and the video generation with lip sync is absolutely game-changing.',
      rating: 5,
      category: 'Agency',
      results: [
        { metric: 'Client Satisfaction', value: '98%', improvement: 'rate' },
        { metric: 'Global Reach', value: '12x', improvement: 'expansion' },
        { metric: 'Project Delivery', value: '75%', improvement: 'faster' }
      ],
      featured: true,
      industry: 'Creative Services',
      companySize: '50-100'
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      role: 'E-commerce Manager',
      company: 'StyleCart',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      quote: 'Multi-language support helped us reach global audiences effortlessly. Our international sales grew by 450% after implementing AI-generated ads in 15 different languages. The ROI is phenomenal.',
      rating: 5,
      category: 'E-commerce',
      results: [
        { metric: 'International Sales', value: '450%', improvement: 'growth' },
        { metric: 'Market Coverage', value: '15', improvement: 'languages' },
        { metric: 'ROI', value: '680%', improvement: 'return' }
      ],
      featured: false,
      industry: 'E-commerce',
      companySize: '100-500'
    },
    {
      id: '4',
      name: 'David Park',
      role: 'Founder & CEO',
      company: 'InnovateNow',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      quote: 'As a startup, we needed high-quality ads without the high-quality budget. AI Ad Maker gave us enterprise-level creative assets at a fraction of the cost. We scaled from 0 to 100K users in 6 months.',
      rating: 5,
      category: 'Startup',
      results: [
        { metric: 'User Growth', value: '100K+', improvement: 'users' },
        { metric: 'Time to Scale', value: '6', improvement: 'months' },
        { metric: 'Creative Costs', value: '90%', improvement: 'savings' }
      ],
      featured: false,
      industry: 'Technology',
      companySize: '10-50'
    },
    {
      id: '5',
      name: 'Jessica Williams',
      role: 'Head of Digital Marketing',
      company: 'FitnessPro',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
      quote: 'The avatar video creation is mind-blowing. We created personalized fitness ads with AI avatars that speak directly to our audience. Engagement rates skyrocketed by 520% and our conversion funnel is performing better than ever.',
      rating: 5,
      category: 'Health & Fitness',
      results: [
        { metric: 'Engagement Rate', value: '520%', improvement: 'increase' },
        { metric: 'Video Completion', value: '89%', improvement: 'rate' },
        { metric: 'Conversion Rate', value: '245%', improvement: 'boost' }
      ],
      featured: true,
      industry: 'Health & Fitness',
      companySize: '100-500'
    },
    {
      id: '6',
      name: 'Robert Martinez',
      role: 'Marketing Manager',
      company: 'EcoHome Solutions',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
      quote: 'The environmental impact messaging in our AI-generated ads resonates perfectly with our audience. We\'ve seen a 380% increase in qualified leads and our brand recognition has never been stronger.',
      rating: 5,
      category: 'Sustainability',
      results: [
        { metric: 'Qualified Leads', value: '380%', improvement: 'increase' },
        { metric: 'Brand Recognition', value: '67%', improvement: 'improvement' },
        { metric: 'Customer Acquisition', value: '156%', improvement: 'growth' }
      ],
      featured: false,
      industry: 'Sustainability',
      companySize: '50-100'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Stories', count: testimonials.length },
    { value: 'Enterprise', label: 'Enterprise', count: testimonials.filter(t => t.category === 'Enterprise').length },
    { value: 'Agency', label: 'Agency', count: testimonials.filter(t => t.category === 'Agency').length },
    { value: 'E-commerce', label: 'E-commerce', count: testimonials.filter(t => t.category === 'E-commerce').length },
    { value: 'Startup', label: 'Startup', count: testimonials.filter(t => t.category === 'Startup').length },
    { value: 'Health & Fitness', label: 'Health & Fitness', count: testimonials.filter(t => t.category === 'Health & Fitness').length }
  ];

  const stats = [
    { 
      metric: 'Average ROI Increase', 
      value: '485%', 
      icon: TrendingUp,
      description: 'Across all customer campaigns'
    },
    { 
      metric: 'Time Savings', 
      value: '89%', 
      icon: Zap,
      description: 'Reduction in creative production time'
    },
    { 
      metric: 'Customer Satisfaction', 
      value: '98%', 
      icon: Target,
      description: 'Rating from active users'
    },
    { 
      metric: 'Success Rate', 
      value: '94%', 
      icon: Award,
      description: 'Campaigns exceeding expectations'
    }
  ];

  const filteredTestimonials = selectedCategory === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedCategory);

  const featuredTestimonials = testimonials.filter(t => t.featured);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === featuredTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => 
      prev === 0 ? featuredTestimonials.length - 1 : prev - 1
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
                <h1 className="text-2xl font-bold gradient-text">Success Stories</h1>
                <p className="text-sm text-muted-foreground">
                  Real results from real customers transforming their advertising
                </p>
              </div>
            </div>
            
            <Button 
              variant="neon-outline" 
              size="sm"
              onClick={() => window.location.href = '/ad-creator'}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Success Story
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 animate-pulse-slow">
            <Users className="w-4 h-4 mr-2" />
            50,000+ Happy Customers
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text glow-text">Real Stories</span>
            <br />
            Real Results
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover how businesses like yours are revolutionizing their advertising with AI. 
            From startups to enterprise, see the incredible impact of intelligent ad creation.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="font-medium mb-1">{stat.metric}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-muted-foreground">Spotlight on our most impactful customer transformations</p>
          </div>

          <div className="relative">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 glow-box">
              <CardContent className="p-8 md:p-12">
                {featuredTestimonials.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Avatar & Info */}
                    <div className="text-center md:text-left">
                      <div className="relative inline-block mb-4">
                        <img
                          src={featuredTestimonials[currentTestimonialIndex].avatar}
                          alt={featuredTestimonials[currentTestimonialIndex].name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-primary/30"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Quote className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-1">
                        {featuredTestimonials[currentTestimonialIndex].name}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {featuredTestimonials[currentTestimonialIndex].role}
                      </p>
                      <p className="text-muted-foreground text-sm mb-3">
                        {featuredTestimonials[currentTestimonialIndex].company}
                      </p>
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                        {featuredTestimonials[currentTestimonialIndex].category}
                      </Badge>
                    </div>

                    {/* Quote */}
                    <div className="md:col-span-2">
                      <blockquote className="text-lg md:text-xl leading-relaxed text-foreground italic mb-6">
                        "{featuredTestimonials[currentTestimonialIndex].quote}"
                      </blockquote>

                      {/* Results */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {featuredTestimonials[currentTestimonialIndex].results.map((result, index) => (
                          <div key={index} className="text-center p-4 rounded-lg bg-muted/20 border border-border/50">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {result.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {result.metric}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <Button
              variant="neon-outline"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="neon-outline"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0"
              onClick={nextTestimonial}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonialIndex
                      ? 'bg-primary w-6'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  onClick={() => setCurrentTestimonialIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-card/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              All <span className="gradient-text">Customer Stories</span>
            </h2>
            <p className="text-muted-foreground">Browse success stories by industry and company size</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'neon' : 'neon-outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="transition-all duration-300"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="group bg-card/50 backdrop-blur-sm border-border/50 hover-lift hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-300"
                        />
                        {testimonial.featured && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-primary-foreground fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {testimonial.name}
                        </h3>
                        <p className="text-primary font-medium text-sm">
                          {testimonial.role}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {testimonial.company}
                        </p>
                        <div className="flex mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-sm leading-relaxed text-muted-foreground italic">
                      "{testimonial.quote.length > 150 
                        ? testimonial.quote.substring(0, 150) + '...' 
                        : testimonial.quote}"
                    </blockquote>

                    {/* Results Highlights */}
                    <div className="grid grid-cols-2 gap-3">
                      {testimonial.results.slice(0, 2).map((result, index) => (
                        <div key={index} className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
                          <div className="text-lg font-bold text-primary">
                            {result.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.metric}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.companySize}
                      </Badge>
                    </div>

                    {/* CTA */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300"
                      onClick={() => toast.info('Full case study coming soon!')}
                    >
                      Read Full Story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
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
            Ready to Write Your <span className="gradient-text">Success Story</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join thousands of successful businesses already transforming their advertising with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => window.location.href = '/ad-creator'}
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Creating Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            
            <Button 
              variant="neon-outline" 
              size="xl"
              onClick={() => window.location.href = '/gallery'}
            >
              <Target className="w-5 h-5 mr-2" />
              View Examples
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            No credit card required • Get started in 2 minutes • 14-day free trial
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;