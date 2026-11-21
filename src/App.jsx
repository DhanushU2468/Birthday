import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import config from './config/birthdayConfig'
import BirthdayWorld from './components/BirthdayWorld'
import MemoryGallery from './components/MemoryGallery'

const stages = ['wish', 'memories', 'photos', 'castle', 'final']

export default function App() {
  const [stage, setStage] = useState('wish')
  const [loaded, setLoaded] = useState(false)
  const [manifest, setManifest] = useState({ photos: [], videos: [], audio: null })
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const audioRef = useRef(null)
  const touchOrigin = useRef(null)

  useEffect(() => {
    fetch('/data/gallery.json').then((r) => r.json()).then(setManifest).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1400)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') setSelectedMedia(null)
    }
    window.addEventListener('keydown', closeWithEscape)
    return () => window.removeEventListener('keydown', closeWithEscape)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
      audioRef.current.volume = volume
    }
  }, [muted, volume])

  const startMusic = () => {
    if (!manifest.audio || !config.musicEnabled) return
    if (!audioRef.current) {
      const audio = new Audio(manifest.audio)
      audio.loop = true
      audioRef.current = audio
    }
    audioRef.current.muted = muted
    audioRef.current.volume = volume
    audioRef.current.play().catch(() => {})
  }

  const goTo = (next) => {
    startMusic()
    setStage(next)
  }

  const nextStage = () => {
    const index = stages.indexOf(stage)
    goTo(stages[Math.min(index + 1, stages.length - 1)])
  }

  const replay = () => setStage('wish')
  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0]
    touchOrigin.current = { x: touch.clientX, y: touch.clientY, target: event.target }
  }
  const handleTouchEnd = (event) => {
    if (!touchOrigin.current) return
    const start = touchOrigin.current
    touchOrigin.current = null
    if (start.target.closest?.('.memory-panel, .lightbox, button, input, video')) return
    const touch = event.changedTouches[0]
    const deltaY = touch.clientY - start.y
    const deltaX = touch.clientX - start.x
    if (Math.abs(deltaY) < 70 || Math.abs(deltaY) < Math.abs(deltaX) * 1.25) return
    const index = stages.indexOf(stage)
    if (deltaY < 0 && index < stages.length - 1) goTo(stages[index + 1])
    if (deltaY > 0 && index > 0) goTo(stages[index - 1])
  }

  const stageLabel = useMemo(() => ({
    wish: 'Your little universe',
    memories: 'Moving memories',
    photos: 'Moments in the sky',
    castle: 'The birthday castle',
    final: 'Today is yours',
  })[stage], [stage])

  return (
    <main className={`experience stage-${stage}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <AnimatePresence>
        {!loaded && (
          <motion.div className="loader" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <div className="loader-orbit"><span /></div>
            <p>Preparing your little universe...</p>
            <div className="loader-line"><i /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {loaded && (
        <>
          <div className="sky-glow" />
          {stage === 'castle' && (
            <div className="castle-background" role="img" aria-label="Dreamy cherry blossom castle above the clouds" />
          )}
          <Canvas
            className="world-canvas"
            dpr={[1, 1.25]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 3.2, 13], fov: 38 }}
          >
            <BirthdayWorld stage={stage} manifest={manifest} onStage={goTo} onOpenMedia={setSelectedMedia} />
          </Canvas>

          <header className="topbar">
            <span className="brand">DREAMY ISLAND</span>
            {manifest.audio && config.musicEnabled && (
              <div className="audio-controls">
                <button onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Unmute music' : 'Mute music'}>
                  {muted ? '♫ ×' : '♫'}
                </button>
                <input aria-label="Music volume" type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))} />
              </div>
            )}
          </header>

          <AnimatePresence mode="wait">
            {stage === 'wish' && (
              <motion.section key="wish" className="wish-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
                <p className="eyebrow">{config.birthdayMessage}</p>
                <h1>{config.subtitle}</h1>
                <p className="story">{config.story}</p>
                <button className="primary-button" onClick={() => goTo('memories')} onPointerDown={startMusic}>
                  Explore Your Memories <span>→</span>
                </button>
              </motion.section>
            )}
          </AnimatePresence>

          {(stage === 'memories' || stage === 'photos') && (
            <MemoryGallery stage={stage} manifest={manifest} onContinue={nextStage} />
          )}

          {stage === 'castle' && (
            <motion.section className="castle-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="eyebrow">One last doorway</p>
              <h2>The castle is glowing.</h2>
              <button className="primary-button" onClick={() => goTo('final')}>Enter the Celebration <span>→</span></button>
            </motion.section>
          )}

          {stage === 'final' && (
            <motion.section className="final-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="eyebrow">For {config.recipientName}</p>
              <h2>{config.finalMessage}</h2>
              <button className="ghost-button" onClick={replay}>Replay the Journey</button>
            </motion.section>
          )}

          <AnimatePresence>
            {selectedMedia && (
              <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMedia(null)}>
                <motion.div className="lightbox-content" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(event) => event.stopPropagation()}>
                  <button className="lightbox-close" onClick={() => setSelectedMedia(null)} aria-label="Close">×</button>
                  {selectedMedia.type === 'video'
                    ? <video src={selectedMedia.src} controls autoPlay playsInline />
                    : <img src={selectedMedia.src} alt={selectedMedia.caption} />}
                  <p>{selectedMedia.type === 'video' ? 'Funny Moments' : selectedMedia.caption}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {stage !== 'wish' && stage !== 'final' && (
            <button className="stage-back" onClick={() => goTo(stages[Math.max(0, stages.indexOf(stage) - 1)])}>←</button>
          )}
          <div className="stage-label">{stageLabel}</div>
        </>
      )}
    </main>
  )
}
