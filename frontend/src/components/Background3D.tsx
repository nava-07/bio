"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function Starfield({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow majesty rotation
      groupRef.current.rotation.y -= delta * 0.05;
      groupRef.current.rotation.x -= delta * 0.02;
      
      // Dynamic parallax drift based on mouse
      groupRef.current.position.x += (mouse.current.x * 0.3 - groupRef.current.position.x) * 0.05;
      groupRef.current.position.y += (-mouse.current.y * 0.3 - groupRef.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars 
        radius={50}      /* Radius of the inner sphere */
        depth={50}       /* Depth of area where stars should fit */
        count={2500}     /* Amount of stars */
        factor={4}       /* Size factor */
        saturation={0}   /* Saturation 0-1 */
        fade             /* Faded dots */
        speed={1}        /* Twinkle speed */
      />
    </group>
  );
}


export default function Background3D() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-transparent pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <Starfield mouse={mouseRef} />
      </Canvas>
    </div>
  );
}
