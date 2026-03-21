import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene6Closing() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center"
      {...sceneTransitions.fadeBlur}
    >
      <motion.div 
        className="font-display font-extrabold text-[8vw] leading-none tracking-tighter text-[var(--color-text-primary)] mb-[4vw]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Saffe
      </motion.div>

      <div className="font-body font-medium text-[4vw] leading-tight text-[var(--color-text-secondary)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Ship fast.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Stay <span className="text-[var(--color-accent)] font-semibold">Saffe.</span>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-[8vw] font-body text-[1.5vw] text-[var(--color-text-secondary)] tracking-wide uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        The security platform built for modern dev teams
      </motion.div>

      <motion.div 
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[var(--color-accent)] opacity-[0.05] blur-[100px]"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
