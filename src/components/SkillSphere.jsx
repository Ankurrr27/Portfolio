"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Image } from "@react-three/drei";
import * as THREE from "three";

const getIconUrl = (name) => {
  const n = name.toLowerCase().replace(/[\s./]+/g, "");
  const mapping = {
    "react": "react",
    "javascript": "javascript",
    "typescript": "typescript",
    "nodejs": "nodejs",
    "node": "nodejs",
    "express": "express",
    "mongodb": "mongodb",
    "mysql": "mysql",
    "postgresql": "postgresql",
    "python": "python",
    "html": "html5",
    "css": "css3",
    "tailwind": "tailwindcss",
    "nextjs": "nextjs",
    "git": "git",
    "docker": "docker",
    "aws": "amazonwebservices",
    "java": "java",
    "cpp": "cplusplus",
    "c": "c",
    "figma": "figma",
    "firebase": "firebase",
    "redux": "redux",
    "linux": "linux",
    "bash": "bash",
  };

  const key = Object.keys(mapping).find(k => n.includes(k));
  const icon = key ? mapping[key] : "javascript"; // Default fallback icon
  
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}/${icon}-original.svg`;
};

function SkillIcon({ word, position }) {
  const meshRef = useRef();
  const url = useMemo(() => getIconUrl(word), [word]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
       <Image
         ref={meshRef}
         url={url}
         position={position}
         scale={0.8}
         transparent
         opacity={0.8}
         onError={(e) => {
            // Fallback if icon not found
            console.warn(`Icon not found for ${word}`);
         }}
       />
    </Float>
  );
}

function Connections({ points }) {
  return null; // Removed lines for cleaner look with logos
}

function Cloud({ skills }) {
  const groupRef = useRef();

  const items = useMemo(() => {
    const temp = [];
    const count = skills.length;
    const radius = 5.5;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      temp.push({
        word: skills[i].name || skills[i],
        position: [x, y, z],
      });
    }
    return temp;
  }, [skills]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((data, i) => (
        <SkillIcon key={i} {...data} />
      ))}
    </group>
  );
}

export default function SkillSphere({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="w-full h-[450px] md:h-[600px] relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

        <Sphere args={[4.2, 64, 64]}>
          <MeshDistortMaterial
            color="#6366f1"
            roughness={0.1}
            metalness={0.8}
            distort={0.3}
            speed={1.5}
            transparent
            opacity={0.05}
          />
        </Sphere>

        <Cloud skills={skills} />
      </Canvas>
    </div>
  );
}
