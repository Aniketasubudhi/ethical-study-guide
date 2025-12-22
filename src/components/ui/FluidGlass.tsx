import { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface LensProps {
  scale?: number;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
}

interface BarProps {
  scale?: number;
  ior?: number;
  thickness?: number;
}

interface CubeProps {
  scale?: number;
  ior?: number;
  thickness?: number;
}

interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: LensProps;
  barProps?: BarProps;
  cubeProps?: CubeProps;
}

// Glass shape that follows cursor
const GlassShape = ({ 
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {}
}: FluidGlassProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());

  const {
    scale: lensScale = 0.25,
    ior: lensIor = 1.15,
    thickness: lensThickness = 5,
    chromaticAberration: lensChromaticAberration = 0.1,
    anisotropy: lensAnisotropy = 0.01
  } = lensProps;

  const {
    scale: barScale = 0.15,
    ior: barIor = 1.2,
    thickness: barThickness = 3
  } = barProps;

  const {
    scale: cubeScale = 0.12,
    ior: cubeIor = 1.3,
    thickness: cubeThickness = 2
  } = cubeProps;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Calculate target position from mouse
    targetPosition.current.set(
      mouse.x * viewport.width * 0.5,
      mouse.y * viewport.height * 0.5,
      0
    );

    // Smooth interpolation for fluid movement
    currentPosition.current.lerp(targetPosition.current, 0.08);
    
    meshRef.current.position.copy(currentPosition.current);

    // Subtle rotation based on movement
    const velocityX = targetPosition.current.x - currentPosition.current.x;
    const velocityY = targetPosition.current.y - currentPosition.current.y;
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      velocityX * 0.3,
      0.1
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -velocityY * 0.3,
      0.1
    );
  });

  const getGeometry = () => {
    switch (mode) {
      case 'bar':
        return <boxGeometry args={[barScale * 8, barScale * 2, barScale * 2]} />;
      case 'cube':
        return <boxGeometry args={[cubeScale * 4, cubeScale * 4, cubeScale * 4]} />;
      case 'lens':
      default:
        return <sphereGeometry args={[lensScale * 2, 64, 64]} />;
    }
  };

  const getMaterialProps = () => {
    switch (mode) {
      case 'bar':
        return {
          ior: barIor,
          thickness: barThickness,
          chromaticAberration: 0.05,
          anisotropy: 0.1,
        };
      case 'cube':
        return {
          ior: cubeIor,
          thickness: cubeThickness,
          chromaticAberration: 0.08,
          anisotropy: 0.05,
        };
      case 'lens':
      default:
        return {
          ior: lensIor,
          thickness: lensThickness,
          chromaticAberration: lensChromaticAberration,
          anisotropy: lensAnisotropy,
        };
    }
  };

  const materialProps = getMaterialProps();

  return (
    <mesh ref={meshRef}>
      {getGeometry()}
      <MeshTransmissionMaterial
        backside
        samples={8}
        resolution={512}
        transmission={1}
        roughness={0.0}
        clearcoat={1}
        clearcoatRoughness={0.0}
        {...materialProps}
        color="white"
        attenuationColor="white"
        attenuationDistance={0.5}
      />
    </mesh>
  );
};

// Fallback when WebGL is not available or model fails to load
const Fallback = () => null;

const FluidGlass = (props: FluidGlassProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'normal' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Fallback />}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <GlassShape {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FluidGlass;
