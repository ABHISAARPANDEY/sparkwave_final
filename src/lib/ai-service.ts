class AIService {
  private kieApiKey: string;
  private a4fApiKey: string;
  private kieBaseUrl: string = 'https://api.kie.ai/api/v1';
  private a4fBaseUrl: string = 'https://api.a4f.co/v1';

  constructor() {
    this.kieApiKey = import.meta.env.VITE_KIE_API_KEY;
    this.a4fApiKey = import.meta.env.VITE_A4F_API_KEY;
    
    if (this.kieApiKey) {
      console.log('✅ KIE.AI API configured successfully');
    } else {
      console.warn('⚠️ KIE.AI API key not configured');
    }

    if (this.a4fApiKey) {
      console.log('✅ A4F.co API configured successfully');
    } else {
      console.warn('⚠️ A4F.co API key not configured');
    }
  }

  // A4F.co API for script generation
  async generateScript(prompt: string, platform: string, videoType: string, language: string): Promise<string[]> {
    if (!this.a4fApiKey) {
      throw new Error('A4F.co API key not configured.');
    }

    console.log('📝 Generating script with A4F.co API...');

    const systemPrompt = `You are an expert video script writer. Create 3 engaging video scripts for a ${videoType} video to be published on ${platform}. 
    
    Requirements:
    - Platform: ${platform}
    - Video Type: ${videoType}
    - Language: ${language}
    - Create 3 different script variations
    - Each script should be 30-60 seconds when spoken
    - Make them engaging, clear, and platform-appropriate
    - Include hooks, clear value propositions, and strong calls-to-action
    - Use perfect spelling and grammar throughout
    - Write professionally with no spelling mistakes
    - Ensure scripts are suitable for video generation with clear visual cues
    
    IMPORTANT: Return ONLY a valid JSON array of exactly 3 strings. No additional text, explanations, or formatting. Example format:
    ["First script here...", "Second script here...", "Third script here..."]`;

    const requestBody = {
      model: "provider-3/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    };

    try {
      const response = await fetch(`${this.a4fBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.a4fApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ A4F.co API request failed:', response.status, errorText);
        throw new Error(`A4F.co API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📄 A4F.co API response:', data);

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from A4F.co API');
      }

      console.log('📄 Raw API content:', content);

      // Try to parse as JSON array first
      try {
        const scripts = JSON.parse(content);
        if (Array.isArray(scripts) && scripts.length > 0) {
          console.log('✅ Parsed as JSON array:', scripts);
          return scripts;
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse as JSON, trying other methods');
      }

      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\[.*?\])\s*```/s);
      if (jsonMatch) {
        try {
          const scripts = JSON.parse(jsonMatch[1]);
          if (Array.isArray(scripts) && scripts.length > 0) {
            console.log('✅ Extracted JSON from markdown:', scripts);
            return scripts;
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse extracted JSON');
        }
      }

      // Try to find array-like structure in the content
      const arrayMatch = content.match(/\[(.*?)\]/s);
      if (arrayMatch) {
        try {
          const scripts = JSON.parse(`[${arrayMatch[1]}]`);
          if (Array.isArray(scripts) && scripts.length > 0) {
            console.log('✅ Extracted array from content:', scripts);
            return scripts;
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse extracted array');
        }
      }

      // Fallback: split by lines and create meaningful scripts
      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.match(/^\d+\./) && !line.match(/^[\[\{]/) && !line.match(/^```/));

      if (lines.length > 0) {
        // Create 3 scripts from the content
        const scripts = [];
        const chunkSize = Math.ceil(lines.length / 3);
        
        for (let i = 0; i < 3; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, lines.length);
          const scriptLines = lines.slice(start, end);
          
          if (scriptLines.length > 0) {
            scripts.push(scriptLines.join(' '));
          }
        }
        
        if (scripts.length > 0) {
          console.log('✅ Created scripts from lines:', scripts);
          return scripts;
        }
      }

      // Final fallback: return the content as a single script
      console.log('⚠️ Using content as single script');
      return [content];

    } catch (error) {
      console.error('❌ Script generation failed:', error);
      throw error;
    }
  }

  // KIE AI Veo3 for video generation
  async generateVeo3FastVideo(prompt: string): Promise<string> {
    if (!this.kieApiKey) {
      throw new Error('KIE.AI API key not configured.');
    }

    console.log('🎬 Starting Veo3 Fast video generation...');

    // Enhance prompt to request perfect spelling
    const enhancedPrompt = `Create a video with engaging content, smooth transitions, and perfect spelling and grammar in any text overlays. Ensure all text is professionally written with no spelling mistakes. ${prompt}`;

    const requestBody = {
      prompt: enhancedPrompt,
      imageUrls: [],
      model: 'veo3_fast',
      watermark: '',
      callBackUrl: '',
      aspectRatio: '16:9',
      seeds: Math.floor(Math.random() * 90000) + 10000,
      enableFallback: false
    };

    console.log('📤 Request URL:', `${this.kieBaseUrl}/veo/generate`);
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

    const genRes = await fetch(`${this.kieBaseUrl}/veo/generate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${this.kieApiKey}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', genRes.status);

    if (!genRes.ok) {
      const errText = await genRes.text();
      console.error('❌ Veo3 Fast request failed:', genRes.status, errText);
      throw new Error(`Veo3 Fast request failed: ${genRes.status} - ${errText}`);
    }

    const genData = await genRes.json();
    console.log('📄 Full response data:', JSON.stringify(genData, null, 2));

    let taskId = genData?.data?.taskId || 
                 genData?.taskId || 
                 genData?.id || 
                 genData?.task?.id ||
                 genData?.result?.taskId;

    console.log('🔍 Extracted taskId:', taskId);

    if (!taskId) {
      console.error('❌ No taskId found in response. Full response:', genData);
      throw new Error(`No taskId returned from KIE AI. Response: ${JSON.stringify(genData)}`);
    }

    console.log(`✅ Task submitted successfully. ID: ${taskId}`);
    console.log('📝 Polling for video completion...');

    return await this.pollForVideoCompletion(taskId);
  }

  private async pollForVideoCompletion(taskId: string): Promise<string> {
    const maxPollingAttempts = 20;
    const pollingInterval = 6000;

    for (let attempt = 1; attempt <= maxPollingAttempts; attempt++) {
      console.log(`🔍 Polling attempt ${attempt}/${maxPollingAttempts} for task: ${taskId}`);
      
      try {
        const videoDetailsRes = await fetch(`${this.kieBaseUrl}/veo/record-info?taskId=${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.kieApiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (videoDetailsRes.ok) {
          const videoDetailsData = await videoDetailsRes.json();
          console.log(`📄 Polling response ${attempt}:`, JSON.stringify(videoDetailsData, null, 2));

          const successFlag = videoDetailsData.data?.successFlag;
          console.log(`🚩 Success flag: ${successFlag} (0=Generating, 1=Success, 2=Failed, 3=Generation Failed)`);

          if (successFlag === 1) {
            const finalVideoUrl = videoDetailsData.data?.response?.resultUrls?.[0] ||
                                  videoDetailsData.data?.resultUrls?.[0] ||
                                  videoDetailsData.data?.videoUrl || 
                                  videoDetailsData.data?.url || 
                                  videoDetailsData.videoUrl || 
                                  videoDetailsData.url ||
                                  videoDetailsData.data?.result?.url ||
                                  videoDetailsData.result?.url;

            if (finalVideoUrl) {
              console.log(`🎯 Video completed! URL: ${finalVideoUrl}`);
              return finalVideoUrl;
            } else {
              console.warn('⚠️ Video completed but no URL found:', videoDetailsData);
              break;
            }
          } else if (successFlag === 2 || successFlag === 3) {
            const errorMsg = videoDetailsData.data?.errorMessage || 'Video generation failed';
            console.error(`❌ Video generation failed: ${errorMsg}`);
            throw new Error(`Video generation failed: ${errorMsg}`);
          } else if (successFlag === 0) {
            console.log(`⏳ Video still generating... waiting ${pollingInterval/1000} seconds before next check`);
            if (attempt < maxPollingAttempts) {
              await new Promise(resolve => setTimeout(resolve, pollingInterval));
            }
          }
        } else {
          console.log(`⚠️ Polling attempt ${attempt} failed with status: ${videoDetailsRes.status}`);
        }
      } catch (error) {
        console.log(`❌ Polling attempt ${attempt} error:`, error.message);
      }
    }
    
    console.log('⏰ Polling completed or timed out');
    console.log('⚠️ Polling completed without video URL, falling back to URL construction');
    const fallbackVideoUrl = `https://tempfile.aiquickdraw.com/p/${taskId}`;
    console.log(`🎯 Fallback video URL: ${fallbackVideoUrl}`);
    
    return fallbackVideoUrl;
  }

  // Product URL scraping and analysis
  async scrapeProductInfo(productUrl: string): Promise<{images: string[], title: string, description: string, price?: string, category?: string}> {
    console.log('🔍 Scraping product information from:', productUrl);
    
    try {
      // Use a web scraping service or API (like ScrapingBee, Bright Data, etc.)
      // For now, we'll use a CORS proxy to scrape the URL
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(productUrl)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('Failed to fetch product page');
      }
      
      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      // Extract product information
      const title = this.extractProductTitle(doc);
      const description = this.extractProductDescription(doc);
      const price = this.extractProductPrice(doc);
      const category = this.extractProductCategory(doc);
      const imageUrls = this.extractProductImages(doc, productUrl);
      
      const productData = {
        title,
        description,
        price,
        category,
        images: imageUrls
      };
      
      console.log('✅ Product information scraped:', productData);
      return productData;
      
    } catch (error) {
      console.error('❌ Product scraping failed:', error);
      // Fallback to mock data
      console.log('🔄 Using fallback mock data...');
      return {
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
        ],
        title: "Premium Product from URL",
        description: "High-quality product with excellent features and modern design",
        price: "$99.99",
        category: "Electronics"
      };
    }
  }

  // Helper methods for HTML parsing
  private extractProductTitle(doc: Document): string {
    const selectors = [
      'h1[data-testid="product-title"]',
      'h1.product-title',
      'h1[class*="title"]',
      'h1',
      '.product-name',
      '[data-testid="product-name"]'
    ];
    
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    
    return "Product Title";
  }

  private extractProductDescription(doc: Document): string {
    const selectors = [
      '[data-testid="product-description"]',
      '.product-description',
      '.description',
      '[class*="description"]',
      'meta[name="description"]'
    ];
    
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const content = element.getAttribute('content') || element.textContent;
        if (content && content.trim().length > 20) {
          return content.trim();
        }
      }
    }
    
    return "High-quality product with excellent features and modern design";
  }

  private extractProductPrice(doc: Document): string {
    const selectors = [
      '[data-testid="price"]',
      '.price',
      '[class*="price"]',
      '.product-price',
      '[data-testid="product-price"]'
    ];
    
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent?.trim()) {
        const price = element.textContent.trim();
        if (price.match(/[\$€£¥₹]\d+/) || price.match(/\d+[\$€£¥₹]/)) {
          return price;
        }
      }
    }
    
    return "$99.99";
  }

  private extractProductCategory(doc: Document): string {
    const selectors = [
      '[data-testid="breadcrumb"]',
      '.breadcrumb',
      '.category',
      '[class*="category"]',
      'nav[aria-label="breadcrumb"]'
    ];
    
    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent?.trim()) {
        const category = element.textContent.trim();
        if (category.length > 0 && category.length < 50) {
          return category;
        }
      }
    }
    
    return "Electronics";
  }

  private extractProductImages(doc: Document, baseUrl: string): string[] {
    const images: string[] = [];
    const selectors = [
      'img[data-testid="product-image"]',
      '.product-image img',
      '.product-gallery img',
      '[class*="product-image"] img',
      'img[alt*="product"]',
      'img[src*="product"]'
    ];
    
    for (const selector of selectors) {
      const elements = doc.querySelectorAll(selector);
      elements.forEach((img: Element) => {
        const src = img.getAttribute('src');
        if (src) {
          // Convert relative URLs to absolute
          const absoluteUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href;
          if (absoluteUrl && !images.includes(absoluteUrl)) {
            images.push(absoluteUrl);
          }
        }
      });
    }
    
    // If no product images found, return some fallback images
    if (images.length === 0) {
      return [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
      ];
    }
    
    return images.slice(0, 5); // Limit to 5 images
  }

  // Product ad types
  getProductAdTypes() {
    return [
      { id: 'vfx', name: 'VFX', icon: '🎬', description: 'Visual effects and cinematic style' },
      { id: 'cgi', name: 'CGI', icon: '🎨', description: 'Computer-generated imagery and 3D effects' },
      { id: 'lifestyle', name: 'Lifestyle', icon: '🌟', description: 'Real-world usage and lifestyle scenes' },
      { id: 'minimalist', name: 'Minimalist', icon: '✨', description: 'Clean, simple, and elegant presentation' },
      { id: 'dynamic', name: 'Dynamic', icon: '⚡', description: 'High-energy and fast-paced presentation' }
    ];
  }

  // Generate product-specific script
  async generateProductScript(productInfo: {title: string, description: string, price?: string, category?: string}, platform: string, language: string): Promise<string[]> {
    if (!this.a4fApiKey) {
      throw new Error('A4F.co API key not configured.');
    }

    console.log('📝 Generating product-specific script...');

    const systemPrompt = `You are an expert product marketing script writer. Create 3 engaging video scripts for a product advertisement to be published on ${platform}. 
    
    Product Information:
    - Title: ${productInfo.title}
    - Description: ${productInfo.description}
    - Price: ${productInfo.price || 'Not specified'}
    - Category: ${productInfo.category || 'General'}
    
    Requirements:
    - Platform: ${platform}
    - Language: ${language}
    - Create 3 different script variations
    - Each script should be 30-60 seconds when spoken
    - Focus on product benefits, features, and value proposition
    - Include compelling calls-to-action
    - Make them engaging and platform-appropriate
    - Consider the product category for relevant messaging
    - Use perfect spelling and grammar throughout
    - Write professionally with no spelling mistakes
    - Ensure scripts are suitable for video generation with clear visual cues
    - Include specific visual descriptions for better video generation
    
    IMPORTANT: Return ONLY a valid JSON array of exactly 3 strings. No additional text, explanations, or formatting. Example format:
    ["First script here...", "Second script here...", "Third script here..."]`;

    const requestBody = {
      model: "provider-3/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create product advertisement scripts for: ${productInfo.title}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    };

    try {
      const response = await fetch(`${this.a4fBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.a4fApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ A4F.co API request failed:', response.status, errorText);
        throw new Error(`A4F.co API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📄 A4F.co API response:', data);

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from A4F.co API');
      }

      console.log('📄 Raw API content:', content);

      // Try to parse as JSON array first
      try {
        const scripts = JSON.parse(content);
        if (Array.isArray(scripts) && scripts.length > 0) {
          console.log('✅ Parsed as JSON array:', scripts);
          return scripts;
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse as JSON, trying other methods');
      }

      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\[.*?\])\s*```/s);
      if (jsonMatch) {
        try {
          const scripts = JSON.parse(jsonMatch[1]);
          if (Array.isArray(scripts) && scripts.length > 0) {
            console.log('✅ Extracted JSON from markdown:', scripts);
            return scripts;
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse extracted JSON');
        }
      }

      // Try to find array-like structure in the content
      const arrayMatch = content.match(/\[(.*?)\]/s);
      if (arrayMatch) {
        try {
          const scripts = JSON.parse(`[${arrayMatch[1]}]`);
          if (Array.isArray(scripts) && scripts.length > 0) {
            console.log('✅ Extracted array from content:', scripts);
            return scripts;
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse extracted array');
        }
      }

      // Fallback: split by lines and create meaningful scripts
      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.match(/^\d+\./) && !line.match(/^[\[\{]/) && !line.match(/^```/));

      if (lines.length > 0) {
        // Create 3 scripts from the content
        const scripts = [];
        const chunkSize = Math.ceil(lines.length / 3);
        
        for (let i = 0; i < 3; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, lines.length);
          const scriptLines = lines.slice(start, end);
          
          if (scriptLines.length > 0) {
            scripts.push(scriptLines.join(' '));
          }
        }
        
        if (scripts.length > 0) {
          console.log('✅ Created scripts from lines:', scripts);
          return scripts;
        }
      }

      // Final fallback: return the content as a single script
      console.log('⚠️ Using content as single script');
      return [content];

    } catch (error) {
      console.error('❌ Product script generation failed:', error);
      throw error;
    }
  }

  // Generate video from product images using Veo3
  async generateProductVideo(imageUrl: string, script: string, adType: string = 'lifestyle'): Promise<string> {
    if (!this.kieApiKey) {
      throw new Error('KIE.AI API key not configured.');
    }

    console.log('🎬 Starting product video generation with image...');

    // Enhance prompt based on ad type
    const adTypePrompts = {
      'vfx': 'Create a cinematic VFX video with professional visual effects, dramatic lighting, slow-motion sequences, particle effects, and Hollywood-style cinematography. Include smooth transitions, dramatic pacing, and high-quality visual effects. Include text overlays with perfect spelling and grammar. ',
      'cgi': 'Create a CGI video with computer-generated imagery, 3D models, realistic textures, advanced lighting, and modern digital aesthetics. Include engaging 3D animations, smooth camera movements, and professional rendering. Include text overlays with perfect spelling and grammar. ',
      'lifestyle': 'Create a lifestyle video showing real-world usage, natural lighting, authentic scenes, and relatable moments. Include warm lighting and genuine interactions. Include text overlays with perfect spelling and grammar. ',
      'minimalist': 'Create a clean, minimalist video with simple composition, soft lighting, elegant presentation, and subtle animations. Include smooth, slow movements, clean typography, and sophisticated design. Include text overlays with perfect spelling and grammar. ',
      'dynamic': 'Create a high-energy, fast-paced video with dynamic movement, vibrant colors, engaging transitions, and energetic pacing. Include quick cuts and exciting visuals. Include text overlays with perfect spelling and grammar. '
    };

    const enhancedPrompt = (adTypePrompts[adType] || adTypePrompts['lifestyle']) + script;

    const requestBody = {
      prompt: enhancedPrompt,
      imageUrls: [imageUrl], // Include the product image
      model: 'veo3_fast',
      watermark: '',
      callBackUrl: '',
      aspectRatio: '16:9',
      seeds: Math.floor(Math.random() * 90000) + 10000,
      enableFallback: false
    };

    console.log('📤 Request URL:', `${this.kieBaseUrl}/veo/generate`);
    console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));

    const genRes = await fetch(`${this.kieBaseUrl}/veo/generate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${this.kieApiKey}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', genRes.status);

    if (!genRes.ok) {
      const errText = await genRes.text();
      console.error('❌ Veo3 Fast request failed:', genRes.status, errText);
      throw new Error(`Veo3 Fast request failed: ${genRes.status} - ${errText}`);
    }

    const genData = await genRes.json();
    console.log('📄 Full response data:', JSON.stringify(genData, null, 2));

    let taskId = genData?.data?.taskId || 
                 genData?.taskId || 
                 genData?.id || 
                 genData?.task?.id ||
                 genData?.result?.taskId;

    console.log('🔍 Extracted taskId:', taskId);

    if (!taskId) {
      console.error('❌ No taskId found in response. Full response:', genData);
      throw new Error(`No taskId returned from KIE AI. Response: ${JSON.stringify(genData)}`);
    }

    console.log(`✅ Product video task submitted successfully. ID: ${taskId}`);
    console.log('📝 Polling for video completion...');

    return await this.pollForVideoCompletion(taskId);
  }

  // Generate longer video by creating multiple segments
  async generateLongerVideo(prompt: string, targetDuration: number = 15): Promise<string> {
    if (!this.kieApiKey) {
      throw new Error('KIE.AI API key not configured.');
    }

    console.log(`🎬 Generating longer video (target: ${targetDuration}s)...`);

    // Split the prompt into segments for longer video
    const segments = this.splitPromptIntoSegments(prompt, targetDuration);
    
    try {
      // Generate the first segment
      const firstSegment = await this.generateVeo3FastVideo(segments[0]);
      console.log('✅ First segment generated:', firstSegment);
      
      // For now, return the first segment
      // In a full implementation, you would:
      // 1. Generate multiple segments
      // 2. Use a video processing service to combine them
      // 3. Add transitions between segments
      
      return firstSegment;
      
    } catch (error) {
      console.error('❌ Longer video generation failed:', error);
      // Fallback to regular generation
      return await this.generateVeo3FastVideo(prompt);
    }
  }

  // Split prompt into segments for longer video generation
  private splitPromptIntoSegments(prompt: string, targetDuration: number): string[] {
    const words = prompt.split(' ');
    const wordsPerSegment = Math.ceil(words.length / Math.ceil(targetDuration / 8)); // Assuming 8s per segment
    
    const segments = [];
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segment = words.slice(i, i + wordsPerSegment).join(' ');
      segments.push(segment);
    }
    
    return segments;
  }

  // Alternative: Use a different model
  async generateVideoWithAlternativeModel(prompt: string): Promise<string> {
    if (!this.kieApiKey) {
      throw new Error('KIE.AI API key not configured.');
    }

    console.log('🎬 Trying alternative model...');

    // Try using a different model
    const requestBody = {
      prompt: `Create a detailed video with rich content, smooth transitions, and perfect spelling and grammar in any text overlays. Ensure all text is professionally written with no spelling mistakes or grammatical errors. ${prompt}`,
      imageUrls: [],
      model: 'veo3', // Try the regular veo3 model instead of veo3_fast
      watermark: '',
      callBackUrl: '',
      aspectRatio: '16:9',
      seeds: Math.floor(Math.random() * 90000) + 10000,
      enableFallback: false
    };

    try {
      const genRes = await fetch(`${this.kieBaseUrl}/veo/generate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${this.kieApiKey}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestBody),
      });

      if (!genRes.ok) {
        const errText = await genRes.text();
        console.error('❌ Alternative model request failed:', genRes.status, errText);
        // Fallback to veo3_fast
        return await this.generateVeo3FastVideo(prompt);
      }

      const genData = await genRes.json();
      let taskId = genData?.data?.taskId || genData?.taskId || genData?.id;

      if (!taskId) {
        console.error('❌ No taskId from alternative model, falling back');
        return await this.generateVeo3FastVideo(prompt);
      }

      console.log(`✅ Alternative model task submitted: ${taskId}`);
      return await this.pollForVideoCompletion(taskId);

    } catch (error) {
      console.error('❌ Alternative model failed, using fallback:', error);
      return await this.generateVeo3FastVideo(prompt);
    }
  }

  // Validate and correct spelling in scripts
  async validateScriptSpelling(script: string): Promise<string> {
    if (!this.a4fApiKey) {
      console.warn('⚠️ A4F.co API key not available for spelling validation');
      return script;
    }

    try {
      const requestBody = {
        model: "provider-3/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional proofreader. Correct any spelling mistakes, grammatical errors, and improve the text while maintaining the original meaning and style. Return only the corrected text with no additional explanations."
          },
          {
            role: "user",
            content: `Please correct any spelling mistakes and grammatical errors in this video script: "${script}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      };

      const response = await fetch(`${this.a4fBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.a4fApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const correctedScript = data.choices?.[0]?.message?.content?.trim();
        if (correctedScript && correctedScript !== script) {
          console.log('✅ Script spelling corrected');
          return correctedScript;
        }
      }
    } catch (error) {
      console.warn('⚠️ Spelling validation failed:', error);
    }

    return script;
  }

  // Test connection methods
  async testKIEConnection(): Promise<boolean> {
    if (!this.kieApiKey) return false;
    
    try {
      const response = await fetch(`${this.kieBaseUrl}/veo/record-info?taskId=test`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.kieApiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.status !== 401; // 401 means unauthorized, other errors might be expected
    } catch {
      return false;
    }
  }

  async testA4FConnection(): Promise<boolean> {
    if (!this.a4fApiKey) return false;
    
    try {
      const response = await fetch(`${this.a4fBaseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.a4fApiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const aiService = new AIService();
