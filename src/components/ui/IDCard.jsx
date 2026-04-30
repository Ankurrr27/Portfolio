import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';

const cardGLB = '/assets/lanyard/card.glb';
const fallbackProfileImage = '/images/Ankur_Alora_1.0_Cropped.jpg';

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
  const [hovered, setHovered] = useState(false);
  
  // Create dynamic texture
  const dynamicTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    const draw = (img) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Main Card Body (Deep Dark Base)
      const radius = 60;
      const x = 30, y = 30, w = canvas.width - 60, h = canvas.height - 60;
      
      // Outer Glow/Border Layer (Manual path for compatibility)
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      ctx.fillStyle = '#080808';
      ctx.fill();

      // Subtle Pattern Background (Technical Grid/Circuit)
      ctx.strokeStyle = '#ffffff08';
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Accent Edge
      ctx.strokeStyle = userData.color || '#2563eb';
      ctx.lineWidth = 10;
      ctx.stroke();

      // Top Header Section
      ctx.fillStyle = (userData.color || '#2563eb') + '15';
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, 230);
      ctx.lineTo(x, 230);
      ctx.closePath();
      ctx.fill();
      
      // Technical Specs (Top Left)
      ctx.fillStyle = userData.color || '#2563eb';
      ctx.font = 'bold 30px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('REF_ID: 2024-ANK-27', 80, 100);
      ctx.font = '24px monospace';
      ctx.fillText('SYS_AUTH: VERIFIED', 80, 140);

      // Main Identity Label (Top Right)
      ctx.textAlign = 'right';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('INDIAN INSTITUTE OF INFORMATION TECHNOLOGY', canvas.width - 80, 110);
      ctx.font = 'bold 35px sans-serif';
      ctx.fillText('OFFICIAL IDENTITY CARD', canvas.width - 80, 160);
      
      // Profile Picture Section
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 430, 200, 0, Math.PI * 2);
      ctx.clip();
      if (img) {
        ctx.drawImage(img, canvas.width / 2 - 200, 230, 400, 400);
      } else {
        ctx.fillStyle = '#151515';
        ctx.fill();
      }
      ctx.restore();
      
      // Image Ring
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 430, 200, 0, Math.PI * 2);
      ctx.strokeStyle = userData.color || '#2563eb';
      ctx.lineWidth = 12;
      ctx.stroke();

      // Primary Information
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 110px sans-serif';
      ctx.fillText(userData.name.toUpperCase(), canvas.width / 2, 770);
      
      ctx.fillStyle = (userData.color || '#2563eb');
      ctx.font = 'bold 40px monospace';
      ctx.fillText(`> ${userData.role.toUpperCase()}`, canvas.width / 2, 830);

      // Separator Line
      ctx.strokeStyle = '#ffffff15';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(100, 870); ctx.lineTo(canvas.width - 100, 870); ctx.stroke();

      // Bottom Details
      if (isEnlarged) {
         ctx.fillStyle = '#999999';
         ctx.font = '35px sans-serif';
         ctx.fillText(userData.college.toUpperCase(), canvas.width / 2, 920);
         ctx.fillText(userData.qualification, canvas.width / 2, 970);
         
         ctx.fillStyle = '#ffffff';
         ctx.font = 'bold 45px monospace';
         ctx.fillText(userData.social, canvas.width / 2, 1020);
      } else {
         ctx.fillStyle = '#777777';
         ctx.font = 'bold 35px monospace';
         ctx.fillText(userData.social, canvas.width / 2, 950);
      }
    };

    draw();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.flipY = false;
    texture.rotation = Math.PI;
    texture.center.set(0.5, 0.5);
    
    // Fix mirror image by flipping horizontally
    texture.repeat.set(-1, 1);
    texture.offset.set(1, 0);

    const loadCardImage = (src, allowFallback = true) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        draw(img);
        texture.needsUpdate = true;
      };
      img.onerror = () => {
        if (allowFallback && src !== fallbackProfileImage) {
          loadCardImage(fallbackProfileImage, false);
        }
      };
      img.src = src;
    };

    loadCardImage(userData.imageUrl || fallbackProfileImage);

    return texture;
  }, [userData, isEnlarged]);

  // The large identity-card presentation is the resting size; selection adds subtle emphasis.
  const baseScale = 2.2;
  const enlargedScale = baseScale * 1.1;
  const [currentScale, setCurrentScale] = useState(isEnlarged ? enlargedScale : baseScale);

  useFrame((state) => {
    const targetScale = isEnlarged ? enlargedScale : baseScale;
    setCurrentScale(THREE.MathUtils.lerp(currentScale, targetScale, 0.15));

    if (card.current && !dragged) {
       // Subtle tilt based on pointer - only when NOT enlarged or if focused
       const targetRotationX = (state.pointer.y * 0.15);
       const targetRotationY = (-state.pointer.x * 0.15);
       
       const curRot = card.current.rotation();
       card.current.setRotation(
         { 
           x: THREE.MathUtils.lerp(curRot.x, targetRotationX, 0.1),
           y: THREE.MathUtils.lerp(curRot.y, targetRotationY, 0.1),
           z: curRot.z
         },
         true
       );
    }
  });

  // Calculate dynamic position to keep the top edge near the joint
  const yOffset = -1.1 * currentScale;

  return (
    <group position={[0, 5, 0]}>
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
      <RigidBody position={[1, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
        <CuboidCollider args={[0.75 * currentScale, 1.05 * currentScale, 0.01]} />
        <group
          scale={currentScale}
          position={[0, yOffset, -0.05]}
          onPointerOver={() => { hover(true); setHovered(true); }}
          onPointerOut={() => { hover(false); setHovered(false); }}
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
          {/* Main Card Face - Use a Plane for reliable 1:1 mapping */}
          <mesh 
            position={[0, 0, 0.01]} 
            onPointerOver={() => { hover(true); setHovered(true); }}
            onPointerOut={() => { hover(false); setHovered(false); }}
          >
            <planeGeometry args={[1.5, 2.1]} />
            <meshPhysicalMaterial
              map={dynamicTexture}
              transparent
              clearcoat={isMobile ? 0 : 1}
              clearcoatRoughness={0.15}
              roughness={0.1}
              metalness={0.2}
              emissive={"#000000"}
              emissiveIntensity={0}
            />
          </mesh>

          {/* The 3D Model Body */}
          <mesh geometry={nodes.card.geometry}>
            <meshPhysicalMaterial
              color="#0a0a0a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </RigidBody>
    </group>
  );
}
