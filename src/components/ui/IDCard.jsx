import { useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { BallCollider, CuboidCollider, RigidBody } from '@react-three/rapier';
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
    imageUrl: fallbackProfileImage,
    color: "#6366f1",
    college: "IIIT KOTA",
    qualification: "B.Tech CSE",
    instagram: "@ankurrr27",
    linkedin: "@ankur-personal",
    social: "@ankur-personal"
  },
  isEnlarged = false,
  onToggleEnlarge
}) {
  const { nodes, materials } = useGLTF(cardGLB);
  const vec = new THREE.Vector3();
  const [hovered, setHovered] = useState(false);
  const imageUrl = userData.imageUrl || fallbackProfileImage;
  
  // Create dynamic texture
  const dynamicTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const accent = userData.color || '#2563eb';

    const roundedRect = (x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };
    
    const draw = (img) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const x = 34;
      const y = 34;
      const w = canvas.width - 68;
      const h = canvas.height - 68;

      roundedRect(x, y, w, h, 58);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      ctx.save();
      roundedRect(x, y, w, h, 58);
      ctx.clip();

      const heroHeight = 650;
      const heroGradient = ctx.createLinearGradient(x, y, x + w, y + heroHeight);
      heroGradient.addColorStop(0, '#b7f315');
      heroGradient.addColorStop(0.48, '#25b99a');
      heroGradient.addColorStop(1, '#8dea12');
      ctx.fillStyle = heroGradient;
      ctx.fillRect(x, y, w, heroHeight);

      ctx.fillStyle = '#005b63';
      ctx.beginPath();
      ctx.arc(x + 38, y + 230, 290, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(x + 38, y + 520);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#c3f21f';
      ctx.beginPath();
      ctx.arc(x + w - 25, y + 110, 260, Math.PI / 2, Math.PI * 1.5);
      ctx.lineTo(x + w - 25, y + 400);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#d5f72d';
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 420);
      ctx.quadraticCurveTo(x + w * 0.5, y + 335, x + w - 10, y + 420);
      ctx.quadraticCurveTo(x + w * 0.5, y + 520, x + 10, y + 420);
      ctx.fill();

      ctx.fillStyle = '#0e9f86';
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 420);
      ctx.quadraticCurveTo(x + w * 0.5, y + 470, x + w - 10, y + 420);
      ctx.quadraticCurveTo(x + w * 0.5, y + 370, x + 10, y + 420);
      ctx.fill();

      const photoX = 160;
      const photoY = 142;
      const photoW = 704;
      const photoH = 560;
      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoW, photoH);
        ctx.clip();
        ctx.drawImage(img, photoX, photoY, photoW, photoH);
        ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(0,91,99,0.35)';
        ctx.fillRect(photoX, photoY, photoW, photoH);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PHOTO', canvas.width / 2, 420);
      }

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, y + heroHeight, w, h - heroHeight);
      ctx.restore();

      ctx.strokeStyle = 'rgba(0,91,99,0.18)';
      ctx.lineWidth = 4;
      roundedRect(x + 2, y + 2, w - 4, h - 4, 56);
      ctx.stroke();

      ctx.fillStyle = '#14a486';
      ctx.font = '900 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Ankur', canvas.width / 2 - 36, 760);
      ctx.font = 'italic 900 72px sans-serif';
      ctx.fillText('Alora', canvas.width / 2 + 172, 760);

      ctx.fillStyle = '#12535a';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Full Stack Developer', canvas.width / 2, 810);

      ctx.fillStyle = '#0f5961';
      ctx.font = '900 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('IIIT', 110, 942);
      ctx.fillText('KOTA', 110, 974);

      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ID: ANKUR-27', canvas.width / 2, 954);

      ctx.textAlign = 'right';
      ctx.fillText('IG @ankurrr27', canvas.width - 110, 936);
      ctx.fillText('IN @ankur-personal', canvas.width - 110, 970);
    };

    draw();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
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
        if (process.env.NODE_ENV === "development") {
          console.warn("ID card image failed to load:", src);
        }
        if (allowFallback && src !== fallbackProfileImage) {
          loadCardImage(fallbackProfileImage, false);
        }
      };
      img.src = src;
    };

    loadCardImage(imageUrl);

    return texture;
  }, [
    imageUrl,
    isEnlarged,
    userData.college,
    userData.color,
    userData.name,
    userData.instagram,
    userData.linkedin,
    userData.qualification,
    userData.role,
    userData.social,
  ]);

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
          {/* The 3D Model Body */}
          <mesh geometry={nodes.card.geometry}>
            <meshPhysicalMaterial
              color="#0a0a0a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Thick 3D rim behind the printed face */}
          <mesh position={[0, 0, 0.08]} renderOrder={5}>
            <boxGeometry args={[1.68, 2.34, 0.12]} />
            <meshPhysicalMaterial
              color="#053f46"
              metalness={0.65}
              roughness={0.22}
              clearcoat={1}
              clearcoatRoughness={0.18}
              emissive="#052f34"
              emissiveIntensity={0.12}
            />
          </mesh>
          <mesh position={[0, 0, 0.155]} renderOrder={6}>
            <boxGeometry args={[1.56, 2.2, 0.035]} />
            <meshPhysicalMaterial
              color="#14a486"
              metalness={0.5}
              roughness={0.18}
              clearcoat={1}
              clearcoatRoughness={0.12}
            />
          </mesh>
          {/* Main Card Face - rendered above the rim */}
          <mesh
            position={[0, 0, 0.18]}
            renderOrder={999}
            onPointerOver={() => { hover(true); setHovered(true); }}
            onPointerOut={() => { hover(false); setHovered(false); }}
          >
            <planeGeometry args={[1.44, 2.04]} />
            <meshBasicMaterial
              map={dynamicTexture}
              transparent
              side={THREE.DoubleSide}
              depthTest={false}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
          <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
        </group>
      </RigidBody>
    </group>
  );
}
