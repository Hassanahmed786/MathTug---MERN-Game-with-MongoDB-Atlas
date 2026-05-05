import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CatmullRomCurve3, Vector3, TubeGeometry, MeshStandardMaterial, SphereGeometry } from 'three';
import * as THREE from 'three';

// ── Comments shown when a player is losing ─────────────────────────────────
const LOSING_COMMENTS = [
  "C'mon, you've got this! 💪",
  "Don't give up! 🔥",
  "Fight back! ⚡",
  "Math is your weapon! 🧮",
  "One correct answer can change everything!",
  "BELIEVE IN YOURSELF! 🌟",
  "They're not that smart... 🤔",
  "You trained for this!",
  "FOCUS! 🎯",
  "This is YOUR moment!",
];

const WINNING_COMMENTS = [
  "DOMINATING! 👑",
  "Too easy! 😎",
  "Unstoppable! 🚀",
  "Math LEGEND! 🔥",
];

// ── Floating Speech Bubble ──────────────────────────────────────────────────
function SpeechBubble({ comment, color }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!comment) return;
    setText(comment);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, [comment]);

  if (!visible || !text) return null;

  return (
    <div style={{
      background: 'rgba(10,10,30,0.92)',
      border: `2px solid ${color}`,
      borderRadius: '14px',
      padding: '8px 14px',
      color: color,
      fontSize: '0.75rem',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-display)',
      letterSpacing: '0.04em',
      boxShadow: `0 0 20px ${color}55, 0 4px 20px rgba(0,0,0,0.6)`,
      animation: 'floatUp 2.8s ease-out forwards',
      pointerEvents: 'none',
      position: 'relative',
    }}>
      {text}
      {/* Bubble tail */}
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: `10px solid ${color}`,
      }} />
    </div>
  );
}

// ── 3D Humanoid — anatomically improved ────────────────────────────────────
function Humanoid({ position, color, isP1, ropePosition, emote, comment }) {
  const groupRef    = useRef();
  const spineRef    = useRef();   // whole upper body (torso + head + arms)
  const torsoRef    = useRef();
  const headRef     = useRef();
  const neckRef     = useRef();
  const lShoulderRef = useRef();
  const rShoulderRef = useRef();
  const lForearmRef  = useRef();
  const rForearmRef  = useRef();
  const lThighRef    = useRef();
  const rThighRef    = useRef();
  const lCalfRef     = useRef();
  const rCalfRef     = useRef();

  const intensity   = isP1 ? -ropePosition / 5 : ropePosition / 5;
  const dir         = isP1 ? 1 : -1;   // +1 = facing right (P1), -1 = facing left (P2)
  const pulling     = intensity >  0.15;
  const struggling  = intensity < -0.15;
  const lean        = Math.abs(intensity);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;

    // ── 1. Whole body lean ──────────────────────────────────────────────────
    if (spineRef.current) {
      let targetLean = 0;
      if (pulling)    targetLean = -0.45 * lean * dir; // lean back = away from rope
      if (struggling) targetLean =  0.55 * lean * dir; // lean forward = dragged in
      // Smooth lerp
      spineRef.current.rotation.z = THREE.MathUtils.lerp(
        spineRef.current.rotation.z, targetLean, 0.12
      );
    }

    // ── 2. Torso squash/stretch ─────────────────────────────────────────────
    if (torsoRef.current) {
      const squash = pulling ? 1 + Math.sin(t * 8) * 0.04 * lean : 1;
      torsoRef.current.scale.y = squash;
    }

    // ── 3. Head — look toward rope + strain nod ─────────────────────────────
    if (headRef.current) {
      const nod = pulling ? Math.sin(t * 6) * 0.12 : 0;
      headRef.current.rotation.x = -0.15 + nod; // slight chin-down
      headRef.current.rotation.z = pulling  ?  0.15 * dir :
                                   struggling ? -0.2 * dir : 0;
    }

    // ── 4. Upper Arms — pull back when winning, stretch forward when losing ──
    if (lShoulderRef.current && rShoulderRef.current) {
      const strainVib = pulling ? Math.sin(t * 12) * 0.06 : 0;
      // Both arms reach toward the rope (in the dir direction)
      const baseRot = pulling ? -1.6 : -1.1; // radians (arm angle relative to shoulder)
      lShoulderRef.current.rotation.z =  baseRot * dir + strainVib;
      rShoulderRef.current.rotation.z =  baseRot * dir + strainVib;
      // Slight forward pitch when pulling hard
      lShoulderRef.current.rotation.x = pulling ? -0.3 : 0;
      rShoulderRef.current.rotation.x = pulling ? -0.3 : 0;
    }

    // ── 5. Forearms — elbow bend changes based on pull ──────────────────────
    if (lForearmRef.current && rForearmRef.current) {
      const elbowBend = pulling ? -1.2 : -0.5;
      lForearmRef.current.rotation.z = elbowBend;
      rForearmRef.current.rotation.z = elbowBend;
    }

    // ── 6. Legs — wide bracing stance or frantic slipping ───────────────────
    if (lThighRef.current && rThighRef.current && lCalfRef.current && rCalfRef.current) {
      if (pulling) {
        // Power stance: front leg braced (toward rope), back leg pushed back
        lThighRef.current.rotation.z = -0.35 * dir;
        rThighRef.current.rotation.z =  0.3  * dir;
        lCalfRef.current.rotation.z  =  0.2  * dir; // slight knee bend
        rCalfRef.current.rotation.z  = -0.15 * dir;
      } else if (struggling) {
        const slip = Math.sin(t * 14) * 0.18;
        lThighRef.current.rotation.z = 0.25 * dir + slip;
        rThighRef.current.rotation.z = 0.25 * dir - slip;
        lCalfRef.current.rotation.z  = 0.15;
        rCalfRef.current.rotation.z  = -0.15;
      } else {
        // Idle: slight weight shift
        const breathe = Math.sin(t * 1.8) * 0.03;
        lThighRef.current.rotation.z =  breathe;
        rThighRef.current.rotation.z = -breathe;
        lCalfRef.current.rotation.z  = 0;
        rCalfRef.current.rotation.z  = 0;
      }
    }

    // ── 7. Group — follow rope & effort bounce ──────────────────────────────
    groupRef.current.position.x = position[0] + intensity * 0.45;
    const bounce = pulling    ? Math.abs(Math.sin(t * 7)) * 0.05 * lean
                 : struggling ? Math.abs(Math.sin(t * 16)) * 0.04 * lean
                 : 0;
    groupRef.current.position.y = position[1] + bounce;
  });

  const emissive  = 0.35;
  const mat       = { color, metalness: 0.35, roughness: 0.45, emissive: color, emissiveIntensity: emissive };
  const skinMat   = { color, metalness: 0.2,  roughness: 0.6 };
  const eyeMat    = { color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2 };

  return (
    <group ref={groupRef} position={position}>

      {/* ── Full-body spine group so the whole upper body leans as one ── */}
      <group ref={spineRef}>

        {/* Pelvis / Hips */}
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.32, 0.18, 0.22]} />
          <meshStandardMaterial {...mat} />
        </mesh>

        {/* Torso */}
        <group ref={torsoRef} position={[0, 1.05, 0]}>
          {/* Lower torso (waist) */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.14, 0.22, 4, 12]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          {/* Chest */}
          <mesh position={[0, 0.14, 0]} castShadow>
            <capsuleGeometry args={[0.17, 0.28, 4, 12]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          {/* Shoulder width board */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.48, 0.1, 0.2]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        </group>

        {/* Neck */}
        <group ref={neckRef} position={[0, 1.42, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.075, 0.18, 4, 8]} />
            <meshStandardMaterial {...skinMat} />
          </mesh>

          {/* Head */}
          <group ref={headRef} position={[0, 0.32, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshStandardMaterial {...skinMat} />
            </mesh>
            {/* Brow ridge for more human look */}
            <mesh position={[0, 0.06, 0.19]}>
              <boxGeometry args={[0.28, 0.05, 0.04]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* Left Eye */}
            <mesh position={[-0.08, 0.05, 0.19]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial {...eyeMat} />
            </mesh>
            <mesh position={[-0.08, 0.05, 0.215]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            {/* Right Eye */}
            <mesh position={[0.08, 0.05, 0.19]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial {...eyeMat} />
            </mesh>
            <mesh position={[0.08, 0.05, 0.215]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            {/* Mouth */}
            <mesh position={[0, -0.06, 0.21]}>
              <boxGeometry args={[0.1, 0.02, 0.01]} />
              <meshStandardMaterial color="#000" />
            </mesh>
          </group>
        </group>

        {/* ── Left Arm (shoulder → elbow → hand) ── */}
        <group position={[-0.24, 1.3, 0]}>
          {/* Upper arm pivot at shoulder */}
          <group ref={lShoulderRef}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.28, 4, 8]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            {/* Forearm pivot at elbow */}
            <group position={[0, -0.35, 0]} ref={lForearmRef}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <capsuleGeometry args={[0.055, 0.24, 4, 8]} />
                <meshStandardMaterial {...mat} />
              </mesh>
              {/* Hand */}
              <mesh position={[0, -0.3, 0]} castShadow>
                <sphereGeometry args={[0.065, 8, 8]} />
                <meshStandardMaterial {...skinMat} />
              </mesh>
            </group>
          </group>
        </group>

        {/* ── Right Arm ── */}
        <group position={[0.24, 1.3, 0]}>
          <group ref={rShoulderRef}>
            <mesh position={[0, -0.18, 0]} castShadow>
              <capsuleGeometry args={[0.07, 0.28, 4, 8]} />
              <meshStandardMaterial {...mat} />
            </mesh>
            <group position={[0, -0.35, 0]} ref={rForearmRef}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <capsuleGeometry args={[0.055, 0.24, 4, 8]} />
                <meshStandardMaterial {...mat} />
              </mesh>
              <mesh position={[0, -0.3, 0]} castShadow>
                <sphereGeometry args={[0.065, 8, 8]} />
                <meshStandardMaterial {...skinMat} />
              </mesh>
            </group>
          </group>
        </group>

      </group> {/* end spineRef */}

      {/* ── Legs (pivot at hip, outside spine group so they stay planted) ── */}
      {/* Left Thigh */}
      <group position={[-0.11, 0.62, 0]} ref={lThighRef}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.095, 0.36, 4, 10]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        {/* Left Calf pivot at knee */}
        <group position={[0, -0.44, 0]} ref={lCalfRef}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.075, 0.34, 4, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          {/* Foot */}
          <mesh position={[dir * 0.04, -0.4, 0.05]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.2]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        </group>
      </group>

      {/* Right Thigh */}
      <group position={[0.11, 0.62, 0]} ref={rThighRef}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.095, 0.36, 4, 10]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <group position={[0, -0.44, 0]} ref={rCalfRef}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.075, 0.34, 4, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          <mesh position={[dir * 0.04, -0.4, 0.05]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.2]} />
            <meshStandardMaterial {...mat} />
          </mesh>
        </group>
      </group>

      {/* Ground shadow ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 24]} />
        <meshStandardMaterial color={color} transparent opacity={0.12} />
      </mesh>

      {/* Floating Emote */}
      {emote && (
        <Html position={[0, 2.8, 0]} center>
          <div style={{
            fontSize: '2.2rem',
            animation: 'floatUp 1.5s ease-out forwards',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.7))',
          }}>
            {emote}
          </div>
        </Html>
      )}

      {/* Speech Bubble — interactive comment when struggling */}
      {comment && (
        <Html position={[isP1 ? 0.8 : -0.8, 2.6, 0]} center>
          <SpeechBubble comment={comment} color={color} />
        </Html>
      )}

    </group>
  );
}

// ── Comment Manager — fires comments periodically when player is losing ──────
function useLosingComments(ropePosition) {
  const [p1Comment, setP1Comment] = useState(null);
  const [p2Comment, setP2Comment] = useState(null);
  const p1Timer = useRef(null);
  const p2Timer = useRef(null);

  const fireComment = (setter, timerRef, commentPool) => {
    if (timerRef.current) return; // already scheduled
    const delay = 3000 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      setter(commentPool[Math.floor(Math.random() * commentPool.length)]);
      setTimeout(() => setter(null), 2800);
      timerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    const p1Losing   = ropePosition > 1.5;  // P1 is losing
    const p2Losing   = ropePosition < -1.5; // P2 is losing

    if (p1Losing)  fireComment(setP1Comment, p1Timer, LOSING_COMMENTS);
    if (p2Losing)  fireComment(setP2Comment, p2Timer, LOSING_COMMENTS);
    if (!p1Losing && p1Timer.current) { clearTimeout(p1Timer.current); p1Timer.current = null; }
    if (!p2Losing && p2Timer.current) { clearTimeout(p2Timer.current); p2Timer.current = null; }

    return () => {
      clearTimeout(p1Timer.current);
      clearTimeout(p2Timer.current);
    };
  }, [Math.round(ropePosition * 2) / 2]); // update every 0.5 unit change

  return { p1Comment, p2Comment };
}

// ── Physics Rope — sags based on rope position ──────────────────────────────
function Rope({ ropePosition }) {
  const ropeRef     = useRef();
  const knotRef     = useRef();
  const lightRef    = useRef();
  const targetKnotX = useRef(0);
  const targetSag   = useRef(0.3);

  const knotX = (ropePosition / 5) * 3.2;

  const lightColor  = ropePosition < -0.5 ? '#00f5ff' : ropePosition > 0.5 ? '#ff0080' : '#ffd700';
  const knotEmissive = ropePosition < -0.5 ? '#002233' : ropePosition > 0.5 ? '#330011' : '#221100';

  // Recompute rope geometry dynamically to show sag from tension
  const curve = useMemo(() => {
    // More sag in the middle when rope is near center (neither side dominating)
    const tension = Math.abs(ropePosition) / 5; // 0 = no tension, 1 = max tension
    const sag = 0.55 * (1 - tension * 0.7);     // sag reduces as rope is pulled
    const pts = [
      new Vector3(-4, 0, 0),
      new Vector3(-2.5, -sag * 0.3, 0),
      new Vector3(-1,   -sag * 0.7, 0),
      new Vector3( 0,   -sag,       0),
      new Vector3( 1,   -sag * 0.7, 0),
      new Vector3( 2.5, -sag * 0.3, 0),
      new Vector3( 4,    0, 0),
    ];
    return new CatmullRomCurve3(pts);
  }, [Math.round(ropePosition * 4) / 4]); // recompute every 0.25 units

  const tubeGeo   = useMemo(() => new TubeGeometry(curve, 80, 0.06, 10, false), [curve]);
  const ropeMat   = useMemo(() => new MeshStandardMaterial({ color: '#c8a96e', metalness: 0.35, roughness: 0.35 }), []);
  const knotGeo   = useMemo(() => new SphereGeometry(0.19, 20, 20), []);
  const knotMat   = useMemo(() => new MeshStandardMaterial({
    color: '#ff3c00', emissive: knotEmissive, emissiveIntensity: 2.5, metalness: 0.5, roughness: 0.25,
  }), [knotEmissive]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (knotRef.current) {
      // Smooth knot movement
      targetKnotX.current = THREE.MathUtils.lerp(targetKnotX.current, knotX, 0.07);

      // Knot Y follows the catenary curve approximately
      const tension = Math.abs(ropePosition) / 5;
      const sagAtKnot = 0.55 * (1 - tension * 0.7) * -1;
      const wobble = Math.sin(t * 3.5) * 0.025;

      knotRef.current.position.x = targetKnotX.current;
      knotRef.current.position.y = sagAtKnot + wobble;

      const pulse = 1 + Math.sin(t * 4) * 0.06;
      knotRef.current.scale.setScalar(pulse);
    }

    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight ref={lightRef} position={[knotX, 1, 1]} intensity={3} color={lightColor} distance={7} decay={2} />
      <pointLight position={[-4.5, 0.8, 1.5]} intensity={1.6} color="#00f5ff" distance={6} />
      <pointLight position={[ 4.5, 0.8, 1.5]} intensity={1.6} color="#ff0080" distance={6} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} castShadow />

      {/* Rope tube */}
      <mesh ref={ropeRef} geometry={tubeGeo} material={ropeMat} castShadow />

      {/* Knot */}
      <mesh ref={knotRef} geometry={knotGeo} material={knotMat} position={[knotX, -0.3, 0.1]}>
        <pointLight color={lightColor} intensity={1.5} distance={2} decay={2} />
      </mesh>

      {/* End anchors */}
      <mesh position={[-4, 0, 0]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial color="#00f5ff" emissive="#003344" emissiveIntensity={2} />
      </mesh>
      <mesh position={[4, 0, 0]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial color="#ff0080" emissive="#330022" emissiveIntensity={2} />
      </mesh>

      {/* Centre line marker */}
      <mesh position={[0, -0.5, -0.15]}>
        <boxGeometry args={[0.016, 1.0, 0.01]} />
        <meshStandardMaterial color="#ffd700" opacity={0.3} transparent />
      </mesh>
    </>
  );
}

// ── Canvas Wrapper ──────────────────────────────────────────────────────────
export default function RopeCanvas({ ropePosition = 0, currentEmotes = {} }) {
  const { p1Comment, p2Comment } = useLosingComments(ropePosition);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'visible' }}>
      {/* Side labels */}
      <div style={{
        position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--cyan)',
        letterSpacing: '0.15em', opacity: 0.7, writingMode: 'vertical-rl', zIndex: 2,
      }}>P1 ←</div>
      <div style={{
        position: 'absolute', top: '50%', right: '6px', transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)', fontSize: '0.5rem', color: 'var(--pink)',
        letterSpacing: '0.15em', opacity: 0.7, writingMode: 'vertical-rl', zIndex: 2,
      }}>→ P2</div>

      <Canvas
        camera={{ position: [0, 1.0, 6.2], fov: 52 }}
        style={{ background: 'transparent', overflow: 'visible' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        shadows
      >
        {/* Scale wrapper — 1.35× makes models noticeably larger without rebuilding geometry */}
        <group scale={[1.35, 1.35, 1.35]}>
          <Humanoid
            position={[-3.35, -0.5, 0]}
            color="#00f5ff"
            isP1={true}
            ropePosition={ropePosition}
            emote={currentEmotes.player1}
            comment={p1Comment}
          />
          <Humanoid
            position={[3.35, -0.5, 0]}
            color="#ff0080"
            isP1={false}
            ropePosition={ropePosition}
            emote={currentEmotes.player2}
            comment={p2Comment}
          />
          <Rope ropePosition={ropePosition} />
        </group>
      </Canvas>
    </div>
  );
}
