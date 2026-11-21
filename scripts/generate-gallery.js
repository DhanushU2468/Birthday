import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const photoDir = path.join(publicDir, 'memories', 'photos')
const videoDir = path.join(publicDir, 'memories', 'videos')
const audioDir = path.join(publicDir, 'memories', 'audio')

for (const dir of [photoDir, videoDir, audioDir]) fs.mkdirSync(dir, { recursive: true })

const photoTypes = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const videoTypes = new Set(['.mp4', '.webm'])
const caption = (name) => name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const scan = (dir, types) => fs.readdirSync(dir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && types.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const photos = scan(photoDir, photoTypes).map((name, index) => ({
  id: `photo-${index + 1}`, name, src: `/memories/photos/${encodeURIComponent(name)}`, caption: caption(name),
}))
const videos = scan(videoDir, videoTypes).map((name, index) => ({
  id: `video-${index + 1}`, name, src: `/memories/videos/${encodeURIComponent(name)}`, title: caption(name),
}))
const audio = fs.readdirSync(audioDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && ['.mp3', '.wav', '.ogg', '.m4a'].includes(path.extname(entry.name).toLower()))
  .map((entry) => `/memories/audio/${encodeURIComponent(entry.name)}`)

const manifest = { photos, videos, audio: audio[0] ?? null }
fs.mkdirSync(path.join(publicDir, 'data'), { recursive: true })
fs.writeFileSync(path.join(publicDir, 'data', 'gallery.json'), JSON.stringify(manifest, null, 2))
console.log(`Gallery manifest: ${photos.length} photos, ${videos.length} videos`)
