# Deployment Guide - Cloudflare Pages with Wrangler

This guide will help you deploy your Neon Ad Spark application to Cloudflare Pages using Wrangler.

## Prerequisites

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Set up your API keys**:
   - Copy `env.example` to `.env.local`
   - Fill in your actual API keys:
     - `VITE_KIE_API_KEY` - Your KIE.AI API key
     - `VITE_A4F_API_KEY` - Your A4F.co API key

## Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Cloudflare Pages

#### Option A: Deploy to Production
```bash
npm run deploy
```

#### Option B: Deploy to Preview Environment
```bash
npm run deploy:preview
```

#### Option C: Deploy with Custom Domain
```bash
wrangler pages deploy dist --project-name=neon-ad-spark
```

### 3. Set Environment Variables in Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **neon-ad-spark**
3. Go to **Settings** → **Environment variables**
4. Add the following variables:
   - `VITE_KIE_API_KEY` = your_kie_api_key
   - `VITE_A4F_API_KEY` = your_a4f_api_key

### 4. Configure Custom Domain (Optional)

1. In Cloudflare Pages dashboard, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain name
4. Follow the DNS configuration instructions

## Development Workflow

### Local Development with Wrangler
```bash
# Build first
npm run build

# Then serve with Wrangler
npm run pages:dev
```

### Continuous Deployment

You can set up automatic deployments by connecting your GitHub repository:

1. In Cloudflare Pages dashboard, click **Create a project**
2. Connect your GitHub account
3. Select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)

## Troubleshooting

### Common Issues

1. **Build fails**: Make sure all dependencies are installed with `npm install`
2. **Environment variables not working**: Ensure they're set in Cloudflare Pages dashboard
3. **Routing issues**: The `wrangler.toml` includes SPA routing configuration
4. **API calls failing**: Check that your API keys are correctly set in the environment variables

### Useful Commands

```bash
# Check deployment status
wrangler pages deployment list --project-name=neon-ad-spark

# View deployment logs
wrangler pages deployment tail --project-name=neon-ad-spark

# Delete a deployment
wrangler pages deployment delete <deployment-id> --project-name=neon-ad-spark
```

## Performance Optimizations

The configuration includes several optimizations:

- **Code splitting**: Vendor, router, and UI libraries are split into separate chunks
- **Caching headers**: Static assets are cached for 1 year
- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **SPA routing**: All routes redirect to index.html for client-side routing

## Monitoring

Monitor your deployment in the Cloudflare Pages dashboard:
- View analytics and performance metrics
- Check error logs
- Monitor bandwidth usage
- View deployment history

Your app will be available at: `https://neon-ad-spark.pages.dev` (or your custom domain)
