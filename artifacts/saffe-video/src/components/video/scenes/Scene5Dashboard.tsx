import { motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene5Dashboard() {
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReport(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Security Scans', val: '12', color: 'var(--color-accent)' },
    { label: 'Deep Scans', val: '4', color: 'var(--color-danger)' },
    { label: 'Cost Estimates', val: '3', color: 'var(--color-success)' }
  ];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10 px-[8vw] overflow-hidden"
      {...sceneTransitions.slideLeft}
    >
      <div className="w-full h-[75vh] flex flex-col gap-[2vw]">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-end"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div>
            <h1 className="font-display font-bold text-[3vw] leading-none mb-[0.5vw]">Dashboard</h1>
            <p className="font-body text-[1.2vw] text-[var(--color-text-secondary)]">Platform overview and recent activity</p>
          </div>
          <div className="pointer-events-none bg-[var(--color-secondary)] border border-[var(--color-border)] px-[2vw] py-[0.8vw] rounded-lg font-body text-[1vw] flex items-center gap-[0.5vw]">
            <span>📧</span> Send Report
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-3 gap-[2vw]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } }
          } as Variants}
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
              className="glass-panel p-[2vw] rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[4px]" style={{ backgroundColor: stat.color }} />
              <div className="font-body text-[1.1vw] text-[var(--color-text-secondary)] mb-[1vw]">{stat.label}</div>
              <div className="font-display font-bold text-[3.5vw]">{stat.val}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div 
          className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="bg-[var(--color-primary)] border-b border-[var(--color-border)] px-[2vw] py-[1vw] grid grid-cols-4 font-body text-[1vw] text-[var(--color-text-secondary)]">
            <div>Target</div>
            <div>Type</div>
            <div>Status</div>
            <div className="text-right">Date</div>
          </div>
          
          <div className="flex-1 p-[1vw] flex flex-col gap-[0.5vw]">
            {[
              { target: 'myapp.example.com', type: 'Security Scan', status: 'Critical', date: 'Just now' },
              { target: 'github.com/company/backend', type: 'Deep Code Scan', status: 'High', date: '2 hrs ago' },
              { target: 'github.com/company/monorepo', type: 'Cost Estimate', status: 'Complete', date: '1 day ago' },
            ].map((row, i) => (
              <motion.div 
                key={i}
                className="grid grid-cols-4 px-[1vw] py-[1.2vw] bg-[rgba(255,255,255,0.02)] rounded-lg font-body text-[1.1vw] items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + (i * 0.2) }}
              >
                <div className="font-mono text-[1vw] truncate pr-[2vw]">{row.target}</div>
                <div>{row.type}</div>
                <div>
                  <span className={`px-[1vw] py-[0.3vw] rounded-full text-[0.9vw] ${
                    row.status === 'Critical' ? 'bg-[rgba(255,59,48,0.1)] text-[var(--color-danger)]' : 
                    row.status === 'High' ? 'bg-[rgba(255,159,10,0.1)] text-[var(--color-warning)]' : 
                    'bg-[rgba(52,199,89,0.1)] text-[var(--color-success)]'
                  }`}>
                    {row.status}
                  </span>
                </div>
                <div className="text-right text-[var(--color-text-secondary)]">{row.date}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Report Notification */}
        {showReport && (
          <motion.div 
            className="absolute top-[2vw] right-[8vw] bg-[var(--color-success)] text-white px-[2vw] py-[1vw] rounded-xl font-body text-[1.1vw] font-medium shadow-2xl flex items-center gap-[1vw]"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <span className="text-[1.5vw]">✅</span>
            Executive Report Sent!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
