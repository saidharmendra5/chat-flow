# ChatFlow Backend

## Deployment Instructions

### Environment Variables
Set these environment variables in your hosting platform:
```
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatflow
JWT_SECRET_KEY=your-super-secret-jwt-key-here
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Deploy to Railway
1. Connect your GitHub repository to Railway
2. Set root directory to `chatbackend`
3. Add all environment variables
4. Deploy

### Deploy to Render
1. Connect your GitHub repository to Render
2. Set root directory to `chatbackend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables

### Deploy to Heroku
1. Create a new Heroku app
2. Set buildpack to Node.js
3. Add all environment variables in Config Vars
4. Deploy from GitHub

### Local Development
```bash
npm install
npm start
```

## Database Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string and add to MONGO_URI
4. Whitelist your deployment platform's IP addresses