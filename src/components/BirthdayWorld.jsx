import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, Html } from '@react-three/drei'
import * as THREE from 'three'

function Island() {
  const island = useRef()
  useFrame((state) => {
    if (!island.current) return
    island.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.12
  })
  return (
    <group ref={island}>
      <mesh position={[0, -0.25, 0]} scale={[5.35, 0.5, 3.85]} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial color="#a8ca91" roughness={0.78} />
      </mesh>
      {[-1.9, 0, 1.9].map((x, i) => (
        <mesh key={x} position={[x, -1.95 - (i % 2) * 0.35, 0.1]} scale={[2.15, 2.8, 2.15]} castShadow>
          <coneGeometry args={[1, 3.4, 7]} />
          <meshStandardMaterial color={i === 1 ? '#81768f' : '#92869c'} roughness={0.95} flatShading />
        </mesh>
      ))}
      <mesh position={[0, -0.05, 0.6]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.9, 2.2, 1]}>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#80c4d8" metalness={0.05} roughness={0.18} transparent opacity={0.82} />
      </mesh>
      {[-3.5, 3.45].map((x) => (
        <mesh key={x} position={[x, -1.25, -0.7]} scale={[0.18, 2.45, 0.38]}>
          <planeGeometry args={[1, 1, 6, 12]} />
          <meshStandardMaterial color="#8dcce2" transparent opacity={0.78} roughness={0.08} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <CherryTree position={[-3.3, 0.45, 1.1]} />
      <CherryTree position={[3.15, 0.45, 0.8]} />
      <CherryTree position={[2.7, 0.45, -1.8]} />
      <Bridge />
      <Castle />
    </group>
  )
}

function Bridge() {
  return (
    <group position={[0, 0.08, 2.25]} rotation={[0.08, 0, 0]}>
      {[-0.7, -0.35, 0, 0.35, 0.7].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.13, 0.42, 4, 12]} />
          <meshStandardMaterial color="#dfc6a4" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function CherryTree({ position }) {
  return (
    <group position={position} scale={0.75}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.7, 12]} />
        <meshStandardMaterial color="#765d65" roughness={1} />
      </mesh>
      {[[-0.45, 1.45, 0], [0.35, 1.55, 0], [0, 1.75, 0.25], [0.15, 1.42, -0.35]].map((p, i) => (
        <mesh key={i} position={p} scale={[0.55, 0.48, 0.55]} castShadow>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color={i % 2 ? '#efb3c5' : '#f3c7d3'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Castle() {
  return (
    <group position={[0, 0.28, -0.15]}>
      <mesh position={[0, 1.12, -0.1]} scale={[1.85, 1.18, 0.95]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#f2e4cb" roughness={0.72} />
      </mesh>
      {[-1.35, 1.35].map((x) => (
        <group key={x} position={[x, 0.8, 0]}>
          <mesh position={[0, 1.25, 0]} castShadow>
            <cylinderGeometry args={[0.52, 0.62, 2.65, 24]} />
            <meshStandardMaterial color="#f4ead7" roughness={0.75} />
          </mesh>
          <mesh position={[0, 2.7, 0]} castShadow>
            <coneGeometry args={[0.72, 1.05, 20]} />
            <meshStandardMaterial color="#d5a9bd" roughness={0.7} />
          </mesh>
          {[0.55, 1.35, 2.05].map((y) => (
            <mesh key={y} position={[x > 0 ? 0.38 : -0.38, y, 0]} rotation={[0, 0, 0]}>
              <circleGeometry args={[0.09, 12]} />
              <meshStandardMaterial color="#ffd98a" emissive="#ffc970" emissiveIntensity={2.2} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.58, 0.85]}>
        <circleGeometry args={[0.48, 32]} />
        <meshStandardMaterial color="#ffd98a" emissive="#ffc970" emissiveIntensity={1.8} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 1.2, 0.86]}>
          <circleGeometry args={[0.12, 16]} />
          <meshStandardMaterial color="#ffe3a3" emissive="#ffd48a" emissiveIntensity={1.8} />
        </mesh>
      ))}
    </group>
  )
}

function Petals({ count = 100 }) {
  const positions = useMemo(() => {
    const values = []
    for (let i = 0; i < count; i++) values.push([
      (Math.random() - 0.5) * 16,
      Math.random() * 9 - 2,
      (Math.random() - 0.5) * 10,
    ])
    return values
  }, [count])
  const group = useRef()
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.025
  })
  return (
    <group ref={group}>
      {positions.map((position, i) => (
        <mesh key={i} position={position} scale={[0.028, 0.012, 0.05]} rotation={[i, i * 0.4, i * 0.7]}>
          <circleGeometry args={[1, 6]} />
          <meshBasicMaterial color={i % 3 ? '#efb1c4' : '#f6d5df'} side={THREE.DoubleSide} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  )
}

function Clouds() {
  const clouds = [
    [-7, 2.1, -4, 1.2], [7, 1.4, -5, 1], [-5, -1.5, 2, 0.85], [6, -1.2, 1.5, 0.9],
  ]
  return <>{clouds.map(([x, y, z, s], i) => (
    <Float key={i} speed={0.45} floatIntensity={0.25} rotationIntensity={0}>
      <mesh position={[x, y, z]} scale={[1.8 * s, 0.42 * s, 0.55 * s]}>
        <sphereGeometry args={[1, 20, 12]} />
        <meshStandardMaterial color="#f8eaf2" transparent opacity={0.72} roughness={1} />
      </mesh>
    </Float>
  ))}</>
}

function Cake() {
  return (
    <Float speed={1.2} floatIntensity={0.18}>
      <group position={[0, -0.3, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[1.05, 1.15, 0.65, 32]} />
          <meshStandardMaterial color="#f2c8d4" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.68, 0]} castShadow>
          <cylinderGeometry args={[0.72, 0.82, 0.45, 32]} />
          <meshStandardMaterial color="#fff0d6" roughness={0.6} />
        </mesh>
        {[-0.28, 0, 0.28].map((x) => (
          <group key={x} position={[x, 1.12, 0]}>
            <mesh><cylinderGeometry args={[0.025, 0.035, 0.32, 8]} /><meshStandardMaterial color="#ead5ff" /></mesh>
            <mesh position={[0, 0.22, 0]}><sphereGeometry args={[0.07, 12, 8]} /><meshBasicMaterial color="#ffd56a" /></mesh>
          </group>
        ))}
      </group>
    </Float>
  )
}

function DistantWorld() {
  const mountains = [
    [-8, -2.2, -8, 4], [8, -2.4, -9, 5], [-3, -2.8, -11, 3],
  ]
  return (
    <group>
      {mountains.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s, s * 1.4, s]}>
          <coneGeometry args={[1, 1.8, 5]} />
          <meshStandardMaterial color={i === 1 ? '#9faeca' : '#aaa4c2'} roughness={1} flatShading />
        </mesh>
      ))}
      <Float speed={0.35} floatIntensity={0.2}>
        <mesh position={[7, 4, -7]} scale={[1.7, 0.18, 1.2]}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color="#b9c999" roughness={0.9} />
        </mesh>
      </Float>
      <Float speed={0.5} floatIntensity={0.25}>
        <mesh position={[-7, 3.2, -6]} scale={[1.2, 0.15, 0.85]}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color="#c6b8c4" roughness={0.9} />
        </mesh>
      </Float>
    </group>
  )
}

function CelebrationDetails() {
  const balloons = [
    [-3, 1.8, -1, '#efb1c4'], [3, 2.3, -2, '#b9d7ec'], [-4.2, 3, -4, '#d7c1ec'],
    [4.1, 1.4, 0.5, '#f7dba7'],
  ]
  const heartPositions = useMemo(() => {
    const points = []
    for (let i = 0; i < 95; i++) {
      const t = i / 94 * Math.PI * 2
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      points.push([x * 0.075, y * 0.075 + 3.2, -1.5])
    }
    return points
  }, [])
  return (
    <group>
      {balloons.map(([x, y, z, color], i) => (
        <Float key={i} speed={0.7 + i * 0.1} floatIntensity={0.35}>
          <group position={[x, y, z]}>
            <mesh scale={[0.45, 0.58, 0.45]}>
              <sphereGeometry args={[1, 18, 12]} />
              <meshStandardMaterial color={color} roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.9, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.2, 6]} />
              <meshBasicMaterial color="#f4e8d3" />
            </mesh>
          </group>
        </Float>
      ))}
      {heartPositions.map((position, i) => (
        <mesh key={i} position={position} scale={0.035}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color={i % 2 ? '#ffd7b2' : '#efb1c4'} transparent opacity={0.86} />
        </mesh>
      ))}
    </group>
  )
}

function MemoryCards({ manifest, stage, onOpenMedia }) {
  const cards = stage === 'memories' ? manifest.videos : manifest.photos
  if (!cards.length) return (
    <Html center position={[0, 1.8, 0]}>
      <div className="empty-state">
        <strong>{stage === 'memories' ? 'Video memories await' : 'Photo memories await'}</strong>
        <span>Add files to public/memories/{stage === 'memories' ? 'videos' : 'photos'}</span>
      </div>
    </Html>
  )
  return <>{cards.slice(0, 6).map((item, i) => {
    const angle = (i / Math.min(cards.length, 6)) * Math.PI * 2
    const position = [Math.cos(angle) * 5.2, 1 + (i % 2) * 1.1, Math.sin(angle) * 2.2]
    return (
      <Float key={item.id} speed={1 + i * 0.08} floatIntensity={0.22} rotationIntensity={0.12}>
        <Html transform distanceFactor={6} position={position} style={{ pointerEvents: 'auto' }}>
          <article
            className={`memory-card ${stage === 'memories' ? 'video-card' : 'photo-card'}`}
            role="button"
            tabIndex={0}
            onClick={() => onOpenMedia(stage === 'memories'
              ? { ...item, type: 'video' }
              : { ...item, type: 'photo' })}
          >
            {stage === 'photos' ? (
              <img src={item.src} alt={item.caption} loading="lazy" />
            ) : (
              <video src={item.src} muted preload="metadata" loop playsInline />
            )}
            <span>{stage === 'photos' ? item.caption : 'Funny Moments'}</span>
          </article>
        </Html>
      </Float>
    )
  })}</>
}

export default function BirthdayWorld({ stage, manifest, onStage, onOpenMedia }) {
  const { camera, pointer } = useThree()
  const target = useRef(new THREE.Vector3())
  useEffect(() => {
    target.current.set(stage === 'final' ? 0 : stage === 'castle' ? 0 : stage === 'wish' ? 0 : 0, stage === 'final' ? 1 : 0.5, stage === 'wish' ? 13 : 8)
  }, [stage])
  useFrame((state) => {
    const desiredZ = target.current.z
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, 0.025)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.65, 0.018)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3.2 + pointer.y * 0.38, 0.018)
    camera.lookAt(0, stage === 'wish' ? 0.2 : 0.8, 0)
  })

  const mobile = typeof window !== 'undefined' && window.innerWidth < 700
  return (
    <>
      <color attach="background" args={['#d9d0ea']} />
      <fog attach="fog" args={['#d9d0ea', 11, 24]} />
      <ambientLight intensity={1.15} color="#fff3dd" />
      <directionalLight position={[5, 8, 6]} intensity={2.2} color="#ffe7c7" castShadow />
      <pointLight position={[-4, 2, 3]} intensity={12} distance={10} color="#edb1c9" />
      <Clouds />
      <DistantWorld />
      <Petals count={mobile ? 32 : 90} />
      {stage !== 'final' && stage !== 'castle' && <Island />}
      {(stage === 'memories' || stage === 'photos') && <MemoryCards manifest={manifest} stage={stage} onOpenMedia={onOpenMedia} />}
      {stage === 'final' && (
        <>
          <Cake />
          <CelebrationDetails />
          <Sparkles count={mobile ? 35 : 100} scale={8} size={2} speed={0.35} color="#ffe29a" />
          <Sparkles count={mobile ? 20 : 55} scale={[7, 5, 7]} size={3} speed={0.22} color="#efadc5" />
        </>
      )}
    </>
  )
}
