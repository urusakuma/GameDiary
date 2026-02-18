'use client';
import { motion } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { useDarkModeContext } from '@features/diary/components/ui/state/DarkModeContext';
import { useModalContext } from '@features/diary/components/ui/state/ModalContext';

type OverlayProps = {
  children: ReactNode;
};
const Overlay = ({ children }: OverlayProps) => {
  const { isDarkMode } = useDarkModeContext();
  const { go, shortcutRegister } = useModalContext();
  useEffect(() => {
    if (go === undefined || shortcutRegister === undefined) {
      return;
    }
    const unregister = shortcutRegister((e) => {
      if (e.key === 'Escape') {
        go.home();
      }
    });
    return unregister;
  }, [go, shortcutRegister]);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={go.home}
    >
      <motion.div
        className={`p-6 rounded-lg shadow-lg max-w-lg w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200'} `}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Overlay;
