import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function MemoryGallery({ stage, manifest, onContinue }) {
  const [selected, setSelected] = useState(null)
  const items = stage === 'memories' ? manifest.videos : manifest.photos

  useEffect(() => {
    const close = (event) => event.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <motion.section className="memory-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="memory-heading">
        <div>
          <p className="eyebrow">{stage === 'memories' ? 'Funny moments' : 'Little moments'}</p>
          <h2>{stage === 'memories' ? 'Funny Moments' : 'Float through the moments'}</h2>
        </div>
        <button className="continue-button" onClick={onContinue}>Continue <span>→</span></button>
      </div>
      {items.length === 0 ? (
        <div className="gallery-empty">
          <span>{stage === 'memories' ? 'No videos yet' : 'No photos yet'}</span>
          <p>Place files in <code>public/memories/{stage === 'memories' ? 'videos' : 'photos'}</code>, then rebuild.</p>
        </div>
      ) : (
        <div className="memory-strip">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              className="memory-tile"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => setSelected(item)}
            >
              {stage === 'memories'
                ? <video src={item.src} muted preload="metadata" playsInline />
                : <img src={item.src} alt={item.caption} loading="lazy" />}
              <span>{stage === 'memories' ? 'Funny Moments' : item.caption}</span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="lightbox-content" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} onClick={(event) => event.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close">×</button>
              {stage === 'memories'
                ? <video src={selected.src} controls autoPlay playsInline />
                : <img src={selected.src} alt={selected.caption} />}
              <p>{stage === 'memories' ? 'Funny Moments' : selected.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
