# Dreamy 3D Birthday Island

A self-contained React, Three.js, and React Three Fiber birthday experience.

## Add your memories

- Put photos in `public/memories/photos/`
- Put videos in `public/memories/videos/`
- Put one music file in `public/memories/audio/`

Supported photos: JPG, JPEG, PNG, WebP, AVIF. Supported videos: MP4, WebM.
The gallery manifest is generated automatically before development and production builds.

## Change the birthday message

Edit `src/config/birthdayConfig.js`. You can change the name, main title, subtitle, story, final message, colors, and music settings.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```powershell
npm run build
npm run preview
```

## Deploy to Render

Create a **Static Site** in Render and use:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

The included `render.yaml` can also provision the site.

## Optional Blender model

Run Blender in the project directory:

```powershell
blender --background --python scripts/blender_scene.py
```

This creates `floating-island.blend` and attempts to export `floating-island.glb`. Blender is optional; the website uses a procedural Three.js fallback.
