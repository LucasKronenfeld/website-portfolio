import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus } from '@react-three/drei';
import { useScroll, useTransform, motion as m } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function Scene() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);

  return (
    <m.group style={{ scale }} rotation={[0, rotation, 0]}>
      <Sphere args={[1, 32, 32]} position={[-2.5, 0, 0]}>
        <meshStandardMaterial color="#A78BFA" roughness={0.3} />
      </Sphere>
      <Sphere args={[1, 32, 32]} position={[2.5, 0, 0]}>
        <meshStandardMaterial color="#38BDF8" roughness={0.3} />
      </Sphere>
      <Torus args={[10, 0.1, 16, 100]} rotation-x={Math.PI / 2}>
        <meshStandardMaterial color="#E6EDF3" roughness={0.1} />
      </Torus>
    </m.group>
  );
}

export default function Hero() {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center bg-background text-text overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30 sm:opacity-40 md:opacity-50">
        <Canvas frameloop="demand">
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <Scene />
        </Canvas>
      </div>
      <div className="z-10 px-4 sm:px-6 max-w-5xl mx-auto">
        <m.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-accent bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Lucas Kronenfeld
        </m.h1>
        <m.p 
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          I am a passionate developer and designer, crafting beautiful and functional web experiences that solve real-world problems.
        </m.p>
      </div>
      <div className="absolute bottom-6 sm:bottom-10 z-10">
        <ChevronDownIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted animate-bounce" />
      </div>
    </div>
  );
}
