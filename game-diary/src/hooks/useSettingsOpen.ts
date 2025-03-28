import { useState } from 'react';

export const useSettingOpen = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};
