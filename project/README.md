# ChatFlow Frontend

## Deployment Instructions

### Environment Variables
Create a `.env` file in the project root with:
```
VITE_API_URL=https://your-backend-url.com
```

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Local Development
```bash
npm install
npm run dev
```