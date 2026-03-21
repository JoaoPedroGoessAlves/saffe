import { AnimatePresence, motion } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';

import { Scene0Logo } from './scenes/Scene0Logo';
import { Scene1Problem } from './scenes/Scene1Problem';
import { Scene2UrlScan } from './scenes/Scene2UrlScan';
import { Scene3DeepScan } from './scenes/Scene3DeepScan';
import { Scene4Cost } from './scenes/Scene4Cost';
import { Scene5Dashboard } from './scenes/Scene5Dashboard';
import { Scene6Closing } from './scenes/Scene6Closing';

const SCENE_DURATIONS = {
  logo: 8000,
  problem: 7000,
  urlScan: 15000,
  deepScan: 15000,
  cost: 12000,
  dashboard: 8000,
  closing: 8000,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({
    durations: SCENE_DURATIONS,
  });

  const getFeaturePill = (scene: number) => {
    switch(scene) {
      case 2: return "Security Scan";
      case 3: return "Deep Code Scan";
      case 4: return "Cost Estimator";
      case 5: return "Dashboard";
      default: return null;
    }
  };

  const featurePill = getFeaturePill(currentScene);

  return (
    <div
      className="w-full h-screen overflow-hidden relative bg-[var(--color-primary)] text-[var(--color-text-primary)]"
    >
      {/* Persistent Background */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
          backgroundSize: '4vw 4vw'
        }}
        animate={{
          backgroundPosition: currentScene % 2 === 0 ? '0vw 0vw' : '4vw 4vw'
        }}
        transition={{ duration: 15, ease: "linear" }}
      />

      {/* Persistent Orb */}
      <motion.div 
        className="absolute w-[30vw] h-[30vw] rounded-full blur-[100px] z-0 pointer-events-none"
        animate={{
          x: currentScene === 0 ? '35vw' : currentScene === 1 ? '10vw' : currentScene === 4 ? '60vw' : '50vw',
          y: currentScene === 0 ? '10vh' : currentScene === 1 ? '50vh' : currentScene === 4 ? '-10vh' : '20vh',
          backgroundColor: currentScene === 1 ? 'var(--color-danger)' : currentScene === 4 ? 'var(--color-success)' : 'var(--color-accent)',
          scale: currentScene === 6 ? 2 : 1,
          opacity: currentScene === 1 ? 0.05 : 0.15
        }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Persistent Small Logo (Scenes 1-5) */}
      <AnimatePresence>
        {currentScene > 0 && currentScene < 6 && (
          <motion.div 
            className="absolute top-[3vw] left-[4vw] z-50 font-display font-bold text-[2vw] tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            Saffe
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Feature Pill (Scenes 2-4) */}
      <AnimatePresence mode="wait">
        {featurePill && (
          <motion.div 
            key={featurePill}
            className="absolute top-[3vw] right-[4vw] z-50 bg-[rgba(255,255,255,0.05)] border border-[var(--color-border)] px-[1.5vw] py-[0.5vw] rounded-full font-body text-[1vw] text-[var(--color-text-secondary)] backdrop-blur-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {featurePill}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenes */}
      <AnimatePresence mode="wait">
        {currentScene === 0 && <Scene0Logo key="logo" />}
        {currentScene === 1 && <Scene1Problem key="problem" />}
        {currentScene === 2 && <Scene2UrlScan key="urlScan" />}
        {currentScene === 3 && <Scene3DeepScan key="deepScan" />}
        {currentScene === 4 && <Scene4Cost key="cost" />}
        {currentScene === 5 && <Scene5Dashboard key="dashboard" />}
        {currentScene === 6 && <Scene6Closing key="closing" />}
      </AnimatePresence>
    </div>
  );
}
