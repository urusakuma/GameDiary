'use client';
import { useState } from 'react';

const useSettingOpen = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};
export default useSettingOpen;
