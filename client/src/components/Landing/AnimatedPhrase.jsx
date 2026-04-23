import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PHRASES = [
  'Multi-Agent Systems',
  'Claude Code',
  'Codex Workflows',
  'MCP Tools',
  'Real AI Builds',
];

const AnimatedPhrase = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPhraseIndex((currentIndex) => (currentIndex + 1) % PHRASES.length);
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <span className="animated-phrase" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={PHRASES[phraseIndex]}
          className="animated-phrase__text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {PHRASES[phraseIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedPhrase;
