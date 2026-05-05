import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, MeshTransmissionMaterial, Instance, Instances } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const GlowingRing = ({ radius, tube, speed, color, rotation }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x += delta * speed * 0.5;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.z += delta * speed * 0.2;
  });
  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, tube, 64, 100]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={2.5} 
        toneMapped={false} 
      />
    </mesh>
  );
};

const GlassCore = () => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.y += delta * 0.3;
  });
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2.2, 0]} />
        <MeshTransmissionMaterial 
          backside 
          thickness={1.5} 
          roughness={0.15} 
          transmission={1} 
          ior={1.5} 
          chromaticAberration={0.06} 
          anisotropy={0.1} 
          color="#1e293b" 
        />
        {/* Inner solid wireframe to give structure inside the glass */}
        <mesh>
           <icosahedronGeometry args={[1.8, 0]} />
           <meshBasicMaterial color="#3b82f6" wireframe />
        </mesh>
      </mesh>
    </Float>
  );
};

const DataParticles = ({ count = 150 }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      const speed = Math.random() * 0.5 + 0.1;
      temp.push({ position, speed });
    }
    return temp;
  }, [count]);

  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <Instances ref={ref} limit={count} range={count}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={3} toneMapped={false} />
      {particles.map((data, i) => (
        <Particle key={i} {...data} />
      ))}
    </Instances>
  );
};

const Particle = ({ position, speed }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position.y + Math.sin(t) * 2;
    ref.current.position.x = position.x + Math.cos(t) * 2;
  });
  return <Instance ref={ref} position={position} />;
};

const CameraRig = () => {
  useFrame((state) => {
    // Subtle camera parallax based on mouse movement
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * 2), 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.pointer.y * 2), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const FloatingShapes = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        {/* We do NOT attach a background color here, so the body's background image shows through! */}
        
        {/* Environment lighting for the glass material to reflect the dark aesthetic */}
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#10b981" />

        <CameraRig />

        <group position={[0, 0, -2]}>
          <GlassCore />
          <GlowingRing radius={3.5} tube={0.03} speed={0.4} color="#3b82f6" rotation={[Math.PI / 4, 0, 0]} />
          <GlowingRing radius={4.5} tube={0.02} speed={0.2} color="#10b981" rotation={[0, Math.PI / 3, Math.PI / 6]} />
          <GlowingRing radius={5.5} tube={0.04} speed={-0.3} color="#8b5cf6" rotation={[Math.PI / 2, Math.PI / 4, 0]} />
          <DataParticles />
        </group>

        {/* Post-processing for that cinematic neon glow */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
        </EffectComposer>
        
        {/* Subtle background stars/dust */}
        <Stars radius={50} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default FloatingShapes;
