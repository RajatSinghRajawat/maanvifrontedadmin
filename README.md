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

## Deployment on Render (Static Site)

### Option 1: Using Render Dashboard (Recommended)

1. Go to Render Dashboard → New → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `maanvifronted`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Click "Create Static Site"

### Option 2: Using render.yaml

The `render.yaml` file is already configured. Just connect your repo and Render will use it automatically.

**Important Settings:**
- **Publish Directory:** `dist` (not `./dist`)
- **Build Command:** `npm install && npm run build`
- **Type:** `static` (not `web`)

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: `http://localhost:5000/api`)

## Troubleshooting

If you see "Publish directory build does not exist!":
1. Make sure **Publish Directory** is set to `dist` (not `./dist` or `/dist`)
2. Verify build completes successfully
3. Check that `dist` folder is created after build
