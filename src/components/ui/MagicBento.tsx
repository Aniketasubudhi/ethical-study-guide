import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagicBentoProps {
  children?: ReactNode;
  className?: string;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

const MagicBento = ({
  children,
  className,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = 300,
  particleCount = 12,
  glowColor = '132, 0, 255',
}: MagicBentoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 200 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  // Tilt transforms
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  // Generate stars on mount
  useEffect(() => {
    if (enableStars) {
      const generatedStars: Star[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        delay: Math.random() * 2,
      }));
      setStars(generatedStars);
    }
  }, [enableStars, particleCount]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);

    if (enableSpotlight) {
      containerRef.current.style.setProperty('--spotlight-x', `${x}px`);
      containerRef.current.style.setProperty('--spotlight-y', `${y}px`);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (clickEffect) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card border border-border p-6 cursor-pointer',
        'transition-shadow duration-300',
        enableBorderGlow && isHovered && 'shadow-lg',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        scale: isClicked ? 0.98 : 1,
        boxShadow: enableBorderGlow && isHovered 
          ? `0 0 30px rgba(${glowColor}, 0.3), 0 0 60px rgba(${glowColor}, 0.15), inset 0 0 30px rgba(${glowColor}, 0.05)`
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      transition={{ duration: 0.15 }}
    >
      {/* Spotlight effect */}
      {enableSpotlight && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(${spotlightRadius}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${glowColor}, 0.15), transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Border glow gradient */}
      {enableBorderGlow && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(${glowColor}, 0.2), transparent, rgba(${glowColor}, 0.1))`,
            opacity: isHovered ? 1 : 0,
            maskImage: 'linear-gradient(black, black)',
            WebkitMaskImage: 'linear-gradient(black, black)',
          }}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Stars / Particles */}
      {enableStars && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                backgroundColor: `rgba(${glowColor}, ${star.opacity})`,
                boxShadow: `0 0 ${star.size * 2}px rgba(${glowColor}, 0.5)`,
              }}
              animate={{
                opacity: isHovered ? [star.opacity, star.opacity * 0.3, star.opacity] : 0,
                scale: isHovered ? [1, 1.5, 1] : 0,
              }}
              transition={{
                duration: 2,
                delay: star.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Click ripple effect */}
      {clickEffect && isClicked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${glowColor}, 0.3), transparent 50%)`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2] }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Magnetism indicator */}
      {enableMagnetism && isHovered && (
        <motion.div
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: `calc(50% + ${mouseX.get() * 20}px)`,
            top: `calc(50% + ${mouseY.get() * 20}px)`,
            backgroundColor: `rgba(${glowColor}, 0.8)`,
            boxShadow: `0 0 10px rgba(${glowColor}, 0.5)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: mouseX.get() * 40,
            y: mouseY.get() * 40,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      )}

      {/* Content with auto-hide text */}
      <motion.div
        className="relative z-10"
        animate={{
          opacity: textAutoHide && isHovered ? 0.7 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MagicBento;
