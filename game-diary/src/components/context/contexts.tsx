import { DiaryNameListProvider } from './diaryNameListContext';
const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <DiaryNameListProvider>{children}</DiaryNameListProvider>;
};
export default ContextProvider;
