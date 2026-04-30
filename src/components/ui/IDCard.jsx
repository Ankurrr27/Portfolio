import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';

const cardGLB = '/assets/lanyard/card.glb';

export default function IDCard({ 
  fixed, 
  j1, 
  j2, 
  j3, 
  card, 
  segmentProps, 
  isMobile, 
  dragged, 
  drag, 
  hover,
  userData = { 
    name: "ANKUR", 
    role: "Full Stack Engineer", 
    imageUrl: "/assets/profile.jpg",
    color: "#f97316",
    social: "@ankurrr27"
  },
  isEnlarged = false,
  onToggleEnlarge
}) {
  const { nodes, materials } = useGLTF(cardGLB);
  const vec = new THREE.Vector3();
  
  // Create dynamic texture
  const dynamicTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const draw = (img) => {
      // Background
      ctx.fillStyle = userData.color || '#f97316';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Card Body
      ctx.fillStyle = '#111111';
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Header
      ctx.fillStyle = userData.color || '#f97316';
      ctx.font = 'bold 80px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('IDENTITY CARD', canvas.width / 2, 120);
      
      // Image Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 400, 200, 0, Math.PI * 2);
      ctx.clip();
      if (img) {
        ctx.drawImage(img, canvas.width / 2 - 200, 200, 400, 400);
      } else {
        ctx.fillStyle = '#222222';
        ctx.fill();
      }
      ctx.restore();
      
      ctx.strokeStyle = userData.color || '#f97316';
      ctx.lineWidth = 15;
      ctx.stroke();

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 120px Inter, system-ui, sans-serif';
      ctx.fillText(userData.name.toUpperCase(), canvas.width / 2, 750);
      
      // Role
      ctx.fillStyle = '#888888';
      ctx.font = '50px Inter, system-ui, sans-serif';
      ctx.fillText(userData.role, canvas.width / 2, 830);

      // Social
      ctx.fillStyle = userData.color || '#f97316';
      ctx.font = 'bold 45px monospace';
      ctx.fillText(userData.social, canvas.width / 2, 920);
    };

    draw(); // Initial draw with placeholder

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;

    // Load image and redraw
    if (userData.imageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = userData.imageUrl;
      img.onload = () => {
        draw(img);
        texture.needsUpdate = true;
      };
    }

    return texture;
  }, [userData]);

  const scale = (isEnlarged ? 3.0 : 2.25) * 1.35;

  return (
    <group position={[0, 4, 0]}>
      <RigidBody ref={fixed} {...segmentProps} type="fixed" />
      <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
        <CuboidCollider args={[0.8 * (scale/2.25), 1.125 * (scale/2.25), 0.01]} />
        <group
          scale={scale}
          position={[0, -1.2 * (scale/2.25), -0.05]}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
          onPointerDown={e => {
            e.stopPropagation();
            if (e.button === 0) { // Left click
              onToggleEnlarge?.();
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }
          }}
        >
          <mesh geometry={nodes.card.geometry}>
            <meshPhysicalMaterial
              map={dynamicTexture}
              clearcoat={isMobile ? 0 : 1}
              clearcoatRoughness={0.15}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </RigidBody>
    </group>
  );
}
