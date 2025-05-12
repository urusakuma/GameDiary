import { useDarkModeContext } from './context/darkModeContext';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}
const Background = ({ children }: BackgroundWrapperProps) => {
  const { isDarkMode } = useDarkModeContext();
  return (
    <div
      className={`flex h-screen p-4 overflow-y-clip overflow-x-clip overflow-x-scroll ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
    >
      {children}
    </div>
  );
};
export default Background;
