# Mannvi Admin Panel Frontend

React-based admin panel for Mannvi Enterprises.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Set environment variables:
   - `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.onrender.com/api`)
   - `NODE_VERSION` - Node version (recommended: `18.18.0`)
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start` or `npm run preview`

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)
