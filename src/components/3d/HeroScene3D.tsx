import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// Component: Procedural Floating Island & Farm Rows
// -------------------------------------------------------------
function FloatingFarmIsland() {
  const islandRef = useRef<THREE.Group>(null);

  // Subtle floating animation
  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  return (
    <group ref={islandRef} position={[0, -0.6, 0]}>
      {/* Upper Fertile Soil Top Layer (Circular Disc) */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[4.2, 4.4, 0.45, 48]} />
        <meshStandardMaterial
          color="#3F754A"
          roughness={0.8}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Dark Terracotta Under-Island Bedrock */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[4.4, 3.2, 0.8, 48]} />
        <meshStandardMaterial
          color="#17362C"
          roughness={0.9}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* Farm Furrow Rows (Cultivated Fields) */}
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((z, idx) => (
        <mesh key={idx} position={[-0.8, 0.24, z]} receiveShadow>
          <boxGeometry args={[2.2, 0.08, 0.35]} />
          <meshStandardMaterial color="#2E5A44" roughness={0.9} />
        </mesh>
      ))}

      {/* Water Irrigation Canal */}
      <mesh position={[0.8, 0.23, 0]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.4, 0.06, 3.4]} />
        <meshStandardMaterial
          color="#64B5F6"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// Component: Hub Building Node (FPO, Mandi, Warehouse)
// -------------------------------------------------------------
interface HubNodeProps {
  position: [number, number, number];
  color: string;
  roofColor: string;
  priceTag?: string;
  tagColor?: string;
}

function HubNode({
  position,
  color,
  roofColor,
  priceTag,
  tagColor = '#D9FF55',
}: HubNodeProps) {
  return (
    <group position={position}>
      {/* Concrete Foundation Base */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.2, 0.9]} />
        <meshStandardMaterial color="#CFD8DC" roughness={0.5} />
      </mesh>

      {/* Building Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.75, 0.55, 0.75]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Slanted Barn/Warehouse Roof */}
      <mesh position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.65, 0.45, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.3} />
      </mesh>

      {/* Glowing Indicator Light Pin */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={tagColor} />
      </mesh>

      {/* HTML Floating 3D Label & Price Tag */}
      {priceTag && (
        <Html position={[0, 1.45, 0]} center distanceFactor={10} pointerEvents="none">
          <div className="flex flex-col items-center select-none animate-bounce">
            <div className="bg-[#17362C]/90 backdrop-blur-md text-[#D9FF55] border border-[#D9FF55]/60 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
              {priceTag}
            </div>
            <div className="w-1.5 h-1.5 bg-[#D9FF55] rotate-45 -mt-0.5" />
          </div>
        </Html>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// Component: Animated Growing Plant / Crop Batch
// -------------------------------------------------------------
function GrowingCropBatch({ position }: { position: [number, number, number] }) {
  const plantRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (plantRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.06;
      plantRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={plantRef} position={position}>
      {/* Plant Stems */}
      {[
        [-0.15, 0, 0],
        [0.15, 0, 0.1],
        [0, 0, -0.15],
      ].map((offset, i) => (
        <group key={i} position={offset as [number, number, number]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.03, 0.5, 8]} />
            <meshStandardMaterial color="#81C784" />
          </mesh>
          <mesh position={[0, 0.45, 0]} rotation={[0.4, 0.2, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#D9FF55" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Produce Crate (Harvest Ready) */}
      <mesh position={[0.35, 0.12, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.24, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#FF7043" />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// Component: Animated Logistics Vehicle along Spline Path
// -------------------------------------------------------------
function LogisticsVehicleRoute() {
  const truckRef = useRef<THREE.Group>(null);

  // Closed circuit connecting Farmer -> Aggregator -> Mandi -> Buyer Hub
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.8, 0.28, 1.2),
      new THREE.Vector3(-0.5, 0.28, 1.8),
      new THREE.Vector3(1.6, 0.28, 1.4),
      new THREE.Vector3(2.2, 0.28, -0.4),
      new THREE.Vector3(1.2, 0.28, -1.8),
      new THREE.Vector3(-1.4, 0.28, -1.5),
      new THREE.Vector3(-2.2, 0.28, 0.2),
      new THREE.Vector3(-1.8, 0.28, 1.2),
    ];
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  const curvePoints = useMemo(() => curve.getPoints(80), [curve]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(curvePoints), [curvePoints]);

  useFrame((state) => {
    if (truckRef.current) {
      // Loop over 12 seconds
      const loopTime = 12;
      const t = (state.clock.elapsedTime % loopTime) / loopTime;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);

      truckRef.current.position.copy(pos);
      truckRef.current.position.y += 0.08;

      // Orient truck toward direction of travel
      const lookTarget = pos.clone().add(tangent);
      truckRef.current.lookAt(lookTarget);
    }
  });

  return (
    <>
      {/* Glowing Logistics Spline Road */}
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#D9FF55', transparent: true, opacity: 0.75, linewidth: 2 }))} />

      {/* Mini Insulated Electric Truck */}
      <group ref={truckRef}>
        {/* Cab */}
        <mesh position={[0, 0.08, 0.12]} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.16]} />
          <meshStandardMaterial color="#FF7043" roughness={0.3} />
        </mesh>

        {/* Cargo Container */}
        <mesh position={[0, 0.11, -0.1]} castShadow>
          <boxGeometry args={[0.24, 0.22, 0.32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.3} />
        </mesh>

        {/* Wheels */}
        {[-0.12, 0.12].map((x, xi) =>
          [-0.18, 0.12].map((z, zi) => (
            <mesh key={`${xi}-${zi}`} position={[x, 0.04, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
              <meshStandardMaterial color="#212121" roughness={0.9} />
            </mesh>
          ))
        )}

        {/* Headlight Beams */}
        <mesh position={[0.06, 0.08, 0.21]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#D9FF55" />
        </mesh>
        <mesh position={[-0.06, 0.08, 0.21]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#D9FF55" />
        </mesh>
      </group>
    </>
  );
}

// -------------------------------------------------------------
// Component: Ambient Pollen / Agricultural Particles
// -------------------------------------------------------------
function FloatingParticles() {
  const particleCount = 45;
  const particlesRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D9FF55"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// Main Hero Scene 3D Canvas Assembly
// -------------------------------------------------------------
export const HeroScene3D: React.FC = () => {
  return (
    <div className="w-full h-[420px] sm:h-[500px] lg:h-[560px] rounded-3xl overflow-hidden relative shadow-2xl border border-[#17362C]/20 bg-gradient-to-b from-[#132B23] via-[#17362C] to-[#0D1F19]">
      {/* Animated Labels Around The 3D Scene */}
      {/* 1. Top Left: Gondal APMC */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none animate-pulse">
        <div className="flex items-center gap-2 bg-[#17362C]/85 backdrop-blur-md text-[#F6F1E4] border border-[#D9FF55]/40 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#D9FF55]" />
          <span>Gondal APMC · ₹2,920/qtl</span>
        </div>
      </div>

      {/* 2. Top Right: Ahmedabad Buyer Demand */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#17362C]/85 backdrop-blur-md text-[#F6F1E4] border border-[#FF7043]/40 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#FF7043] animate-ping" />
          <span>Ahmedabad Buyer Demand · High</span>
        </div>
      </div>

      {/* 3. Middle Left: Best Sale Window */}
      <div className="absolute top-1/2 -translate-y-12 left-4 z-20 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-2 bg-[#17362C]/85 backdrop-blur-md text-[#D9FF55] border border-[#D9FF55]/30 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9FF55]" />
          <span>Best sale window · 3 days</span>
        </div>
      </div>

      {/* 4. Middle Right: Verified Buyer */}
      <div className="absolute top-1/2 -translate-y-4 right-4 z-20 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-2 bg-[#17362C]/85 backdrop-blur-md text-[#F6F1E4] border border-emerald-400/40 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Verified buyer · 96/100</span>
        </div>
      </div>

      {/* 5. Bottom Right: Shared Route */}
      <div className="absolute bottom-12 right-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#17362C]/90 backdrop-blur-md text-[#D9FF55] border border-[#D9FF55]/50 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#D9FF55] animate-pulse" />
          <span>Shared route · ₹1.60/kg</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [5.5, 4.2, 5.5], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Natural Agrarian Warm Lighting */}
        <ambientLight intensity={0.7} color="#F6F1E4" />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          color="#FFF9C4"
        />
        <pointLight position={[-4, 3, -4]} intensity={0.5} color="#D9FF55" />

        {/* Floating Ecosystem Group */}
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          {/* Circular Ground Terrain */}
          <FloatingFarmIsland />

          {/* Growing Crop Furrows */}
          <GrowingCropBatch position={[-1.2, 0.3, 0.4]} />
          <GrowingCropBatch position={[-0.4, 0.3, -0.6]} />

          {/* Node 1: Farmer & FPO Aggregation Hub */}
          <HubNode
            position={[-1.8, 0, 1.2]}
            color="#3F754A"
            roofColor="#2E5A44"
            priceTag="Saurashtra FPO: ₹2,650"
            tagColor="#81C784"
          />

          {/* Node 2: APMC Mandi Auction Yard */}
          <HubNode
            position={[1.8, 0, -1.4]}
            color="#546E7A"
            roofColor="#37474F"
            priceTag="Gondal APMC: ₹2,680"
            tagColor="#90A4AE"
          />

          {/* Node 3: Institutional Corporate Buyer & Cold Hub */}
          <HubNode
            position={[1.6, 0, 1.4]}
            color="#FF7043"
            roofColor="#D84315"
            priceTag="Amul/Balaji Direct: ₹3,080"
            tagColor="#D9FF55"
          />

          {/* Node 4: GWC Cold Storage Silo */}
          <HubNode
            position={[-1.5, 0, -1.5]}
            color="#26A69A"
            roofColor="#00796B"
            priceTag="GWC Cold Silo"
            tagColor="#80CBC4"
          />

          {/* Dynamic Transport Vehicle Route */}
          <LogisticsVehicleRoute />

          {/* Slow Atmosphere Floating Pollen */}
          <FloatingParticles />
        </Float>

        {/* Smooth Orbit Controls for User Exploration */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Floating 3D Scene Controls Hint */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-[#F6F1E4]/70 bg-[#17362C]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D9FF55] animate-pulse" />
          Interactive 3D Gujarat Agro-Market Ecosystem
        </span>
        <span className="hidden sm:inline font-mono text-[10px]">Rotate 3D: Drag / Touch</span>
      </div>
    </div>
  );
};
