'use client';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface OverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  isDarkMode: boolean;
}

const Overlay = ({ children, onClose, isDarkMode }: OverlayProps) => {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose}
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
