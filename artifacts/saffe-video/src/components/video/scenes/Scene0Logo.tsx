import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene0Logo() {
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const letterVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotateY: 90, rotateX: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0, 
      rotateX: 0,
      transition: { type: 'spring', stiffness: 200, damping: 12 }
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      {...sceneTransitions.fadeBlur}
    >
      <div className="relative">
        <motion.div 
          className="flex font-display font-extrabold text-[12vw] leading-none tracking-tighter"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.5 }}
        >
          {['S', 'a', 'f', 'f', 'e'].map((l, i) => (
            <motion.span key={i} variants={letterVariants} className="text-[var(--color-text-primary)]">
              {l}
            </motion.span>
          ))}
        </motion.div>
        
        {showSubtitle && (
          <motion.div 
            className="absolute -bottom-[3vw] left-0 right-0 flex justify-center space-x-2 font-body text-[2.5vw] text-[var(--color-text-secondary)] font-medium"
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>Ship fast.</span>
            <span className="text-[var(--color-accent)]">Stay Saffe.</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
