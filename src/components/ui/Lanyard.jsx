/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment, Lightformer } from '@react-three/drei';
import { Physics, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import IDCard from './IDCard';
const lanyardTexture = '/assets/lanyard/lanyard.png';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ 
  position = [0, 0, 30], 
  gravity = [0, -40, 0], 
  fov = 20, 
  transparent = true,
  userData = { 
    name: "ANKUR", 
    role: "Full Stack Engineer", 
    imageUrl: "/assets/profile.jpg",
    color: "#6366f1",
    social: "@ankurrr27"
  },
  opacity = 1
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isEnlarged, setIsEnlarged] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (opacity <= 0) return null;

  return (
    <div 
      className={`lanyard-wrapper ${isEnlarged ? 'enlarged' : ''}`}
      style={{ opacity, pointerEvents: opacity < 0.1 ? 'none' : 'auto' }}
    >
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band 
            isMobile={isMobile} 
            userData={userData} 
            isEnlarged={isEnlarged} 
            onToggleEnlarge={() => setIsEnlarged(!isEnlarged)} 
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false, userData, isEnlarged, onToggleEnlarge }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
    
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { width, height } = useThree((state) => state.size);
  
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );

  // Create dynamic rope texture
  const ropeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Blue background
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Institutional Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const text = "INDIAN INSTITUTE OF INFORMATION TECHNOLOGY KOTA • ";
    const repeatedText = text.repeat(3);
    ctx.fillText(repeatedText, canvas.width / 2, canvas.height / 2);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }, []);

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  const ropeLength = isEnlarged ? 0.3 : 0.35;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      
      // Stabilization torque to keep it facing forward and upright
      const restorativeTorqueY = -rot.y * 0.5;
      const restorativeTorqueX = -rot.x * 0.5;
      const restorativeTorqueZ = -rot.z * 0.5;

      card.current.setAngvel({ 
        x: ang.x * 0.95 + restorativeTorqueX, 
        y: ang.y * 0.95 + restorativeTorqueY, 
        z: ang.z * 0.95 + restorativeTorqueZ 
      }, true);
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <IDCard 
        fixed={fixed} j1={j1} j2={j2} j3={j3} card={card} 
        segmentProps={segmentProps} isMobile={isMobile} 
        dragged={dragged} drag={drag} hover={hover} 
        userData={userData}
        isEnlarged={isEnlarged}
        onToggleEnlarge={onToggleEnlarge}
      />
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={ropeTexture}
          repeat={[-1, 1]}
          lineWidth={0.15}
        />
      </mesh>
    </>
  );
}
