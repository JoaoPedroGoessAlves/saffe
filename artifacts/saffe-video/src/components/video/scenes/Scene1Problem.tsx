import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene1Problem() {
  const [count, setCount] = useState(0);
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * 73));
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    const timer = setTimeout(() => {
      requestAnimationFrame(animateCount);
    }, 800);
    
    const subTimer = setTimeout(() => setShowSub(true), 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(subTimer);
    };
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-[10vw] text-center"
      {...sceneTransitions.zoomThrough}
    >
      <motion.div 
        className="absolute inset-0 flex items-center justify-center -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div 
          className="w-[60vw] h-[60vw] rounded-full bg-[var(--color-danger)] opacity-[0.05] blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div 
        className="font-display font-bold text-[18vw] leading-none tracking-tighter text-[var(--color-danger)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, delay: 0.5 }}
      >
        {count}%
      </motion.div>
      
      <motion.h2 
        className="font-display font-semibold text-[4.5vw] text-[var(--color-text-primary)] mt-4 w-full"
        initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Vulnerabilities shipped to production. Every. Day.
      </motion.h2>

      {showSub && (
        <motion.div 
          className="flex gap-6 mt-[4vw] font-body text-[2vw] text-[var(--color-text-secondary)]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          } as Variants}
        >
          {['Outdated deps.', 'Exposed secrets.', 'Unaudited code.'].map((text, i) => (
            <motion.span 
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
              } as Variants}
              className="bg-[var(--color-secondary)] px-6 py-3 rounded-full border border-[var(--color-border)]"
            >
              {text}
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
