import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CatmullRomCurve3, Vector3, TubeGeometry, MeshStandardMaterial, SphereGeometry } from 'three';
import * as THREE from 'three';

// ── Humanoid Mesh ────────────────────────────────────────────────────────────
function Humanoid({ position, color, isP1, ropePosition, emote }) {
  const groupRef = useRef();
  const torsoRef = useRef();
  
  // intensity > 0 means pulling hard (winning), intensity < 0 means getting dragged.
  // ropePosition goes -5 (P1 wins) to +5 (P2 wins).
  const intensity = isP1 ? -ropePosition / 5 : ropePosition / 5;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Dramatic lean based on winning/losing
      const baseLean = intensity > 0 ? -1.2 * intensity : -1.6 * intensity;
      const sway = Math.sin(t * (6 + Math.abs(intensity) * 4)) * (0.08 + intensity * 0.1);
      const bounce = Math.sin(t * 3) * 0.02;
      
      groupRef.current.rotation.z = isP1 ? (baseLean + sway + bounce) : -(baseLean + sway + bounce);
      groupRef.current.position.y = Math.sin(t * 2.5) * 0.08;
    }
    
    if (torsoRef.current && Math.abs(intensity) > 0.3) {
      torsoRef.current.scale.z = 1 + Math.sin(t * 4) * 0.08 * Math.abs(intensity);
    }
  });

  const dir = isP1 ? 1 : -1;
  const glowIntensity = Math.abs(intensity) > 0.5 ? 1.5 : 0.8;

  return (
    <group ref={groupRef} position={position} scale={1.9}>
      {/* Glow aura when pulling */}
      {Math.abs(intensity) > 0.3 && (
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={0.2} 
            transparent 
            opacity={0.1}
            wireframe={false}
          />
        </mesh>
      )}
      
      {/* Torso */}
      <mesh ref={torsoRef} position={[0, 0.4, 0]} rotation={[0, 0, dir * 0.15]}>
        <cylinderGeometry args={[0.12, 0.09, 0.7]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={glowIntensity} 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Head with enhanced glow */}
      <mesh position={[dir * -0.1, 0.85, 0]}>
        <sphereGeometry args={[0.16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.4}
          metalness={0.8}
          roughness={0.1}
        />
        <pointLight color={color} intensity={0.8} distance={2} />
      </mesh>
      
      {/* Floating Emote - Larger and more visible */}
      {emote && (
        <Html position={[0, 1.8, 0]} center>
          <div style={{
            fontSize: '2.8rem',
            animation: 'floatUp 2s ease-out forwards',
            pointerEvents: 'none',
            textShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(255,255,255,0.5)',
            fontWeight: 'bold',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
          }}>
            {emote}
          </div>
        </Html>
      )}
      
      {/* Front Arm (holding rope) - Enhanced */}
      <mesh position={[dir * 0.25, 0.4, 0.15]} rotation={[0, 0, dir * Math.PI / 2.4]}>
        <cylinderGeometry args={[0.045, 0.035, 0.65]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Back Arm (holding rope) - Enhanced */}
      <mesh position={[dir * 0.25, 0.4, -0.15]} rotation={[0, 0, dir * Math.PI / 2.4]}>
        <cylinderGeometry args={[0.045, 0.035, 0.65]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.4}
          metalness={0.6}
        />
      </mesh>
      
      {/* Front Leg (braced) */}
      <mesh position={[dir * 0.15, 0.0, 0.1]} rotation={[0, 0, dir * 0.4]}>
        <cylinderGeometry args={[0.05, 0.04, 0.45]} />
        <meshStandardMaterial color={color} metalness={0.5} />
      </mesh>
      
      {/* Back Leg (pushing) */}
      <mesh position={[dir * -0.2, 0.0, -0.1]} rotation={[0, 0, dir * -0.3]}>
        <cylinderGeometry args={[0.05, 0.04, 0.45]} />
        <meshStandardMaterial color={color} metalness={0.5} />
      </mesh>
    </group>
  );
}

// ── Rope Mesh ──────────────────────────────────────────────────────────────
function Rope({ ropePosition }) {
  const ropeRef = useRef();
  const knotRef = useRef();
  const lightRef = useRef();
  const targetKnotX = useRef(0);

  // Compute knot X from ropePosition (-5..+5) → mapped to (-3..+3) in 3D space
  const knotX = (ropePosition / 5) * 3;

  // Determine dominant side for light color
  const lightColor = ropePosition < -0.5 ? '#00f5ff' : ropePosition > 0.5 ? '#ff0080' : '#ffd700';
  const knotEmissive = ropePosition < -0.5 ? '#004466' : ropePosition > 0.5 ? '#440022' : '#332200';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sway = Math.sin(t * 1.4) * 0.08;
    const sway2 = Math.sin(t * 0.8 + 1) * 0.04;

    // Animate rope sway
    if (ropeRef.current) {
      ropeRef.current.rotation.z = sway * 0.08;
    }

    // Smoothly lerp knot toward target
    if (knotRef.current) {
      targetKnotX.current = THREE.MathUtils.lerp(targetKnotX.current, knotX, 0.06);
      knotRef.current.position.x = targetKnotX.current;
      knotRef.current.position.y = sway2;
      // subtle scale pulse
      const pulse = 1 + Math.sin(t * 3) * 0.05;
      knotRef.current.scale.setScalar(pulse);
    }

    // Animate light
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 2) * 0.5;
    }
  });

  // Build rope curve
  const curve = useMemo(() => {
    const points = [
      new Vector3(-4, 0, 0),
      new Vector3(-2.5, 0.05, 0),
      new Vector3(-1, -0.05, 0),
      new Vector3(0, 0.08, 0),
      new Vector3(1, -0.03, 0),
      new Vector3(2.5, 0.05, 0),
      new Vector3(4, 0, 0),
    ];
    return new CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(
    () => new TubeGeometry(curve, 64, 0.055, 8, false),
    [curve]
  );

  const ropeMaterial = useMemo(
    () => new MeshStandardMaterial({
      color: '#c8a96e',
      metalness: 0.4,
      roughness: 0.3,
      envMapIntensity: 0.8,
    }),
    []
  );

  const knotGeometry = useMemo(() => new SphereGeometry(0.18, 16, 16), []);
  const knotMaterial = useMemo(
    () => new MeshStandardMaterial({
      color: '#ff3c00',
      emissive: knotEmissive,
      emissiveIntensity: 2,
      metalness: 0.6,
      roughness: 0.2,
    }),
    [knotEmissive]
  );

  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.4} />

      {/* Main rope light — tracks knot */}
      <pointLight
        ref={lightRef}
        position={[knotX, 1.2, 1]}
        intensity={3}
        color={lightColor}
        distance={6}
        decay={2}
      />

      {/* Fill lights */}
      <pointLight position={[-4, 0.5, 1]} intensity={1.5} color="#00f5ff" distance={5} />
      <pointLight position={[4, 0.5, 1]} intensity={1.5} color="#ff0080" distance={5} />

      {/* Rope */}
      <mesh ref={ropeRef} geometry={tubeGeometry} material={ropeMaterial} castShadow />

      {/* Knot */}
      <mesh ref={knotRef} geometry={knotGeometry} material={knotMaterial} position={[knotX, 0, 0.1]}>
        {/* Glow halo */}
        <pointLight color={lightColor} intensity={1.5} distance={1.5} decay={2} />
      </mesh>

      {/* End anchors */}
      <mesh position={[-4, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#00f5ff" emissive="#003344" emissiveIntensity={2} />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#ff0080" emissive="#330022" emissiveIntensity={2} />
      </mesh>

      {/* Center line (subtle) */}
      <mesh position={[0, -0.4, -0.1]}>
        <boxGeometry args={[0.015, 0.8, 0.01]} />
        <meshStandardMaterial color="#ffffff" opacity={0.25} transparent />
      </mesh>
    </>
  );
}

// ── Canvas Wrapper ─────────────────────────────────────────────────────────
export default function RopeCanvas({ ropePosition = 0, currentEmotes = {} }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Side labels */}
      <div style={{
        position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--cyan)',
        letterSpacing: '0.15em', opacity: 0.7, writingMode: 'vertical-rl', zIndex: 2,
      }}>P1 ←</div>
      <div style={{
        position: 'absolute', top: '50%', right: '6px', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontSize: '0.55rem', color: 'var(--pink)',
        letterSpacing: '0.15em', opacity: 0.7, writingMode: 'vertical-rl', zIndex: 2,
      }}>→ P2</div>

      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Humanoid position={[-4.3, -0.3, 0]} color="#00f5ff" isP1={true} ropePosition={ropePosition} emote={currentEmotes.player1} />
        <Humanoid position={[4.3, -0.3, 0]} color="#ff0080" isP1={false} ropePosition={ropePosition} emote={currentEmotes.player2} />
        <Rope ropePosition={ropePosition} />
      </Canvas>
    </div>
  );
}
