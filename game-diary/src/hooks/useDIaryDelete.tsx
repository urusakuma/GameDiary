import { IDiaryNameService } from '@/control/controlDiary/controlDiaryInterface';
import { IDiaryDelete } from '@/model/repository/diaryRepositoryInterfaces';
import { useEffect, useState } from 'react';
import { container } from 'tsyringe';

const useDiaryDelete = () => {
  const [dairyDelete, setDiaryDelete] = useState<IDiaryDelete>();
  const [nameService, setNameService] = useState<IDiaryNameService>();

  useEffect(() => {
    const diaryDeleteInstance = container.resolve<IDiaryDelete>('IDiaryDelete');
    setDiaryDelete(diaryDeleteInstance);
    const nameServiceInstance =
      container.resolve<IDiaryNameService>('IDiaryNameService');
    setNameService(nameServiceInstance);
  }, []);
  const deleteDiary = (key: string) => {
    if (dairyDelete === undefined || nameService === undefined) {
      return;
    }
    dairyDelete.delete(key);
    nameService.removeDiaryName(key);
  };
  return { deleteDiary };
};
export default useDiaryDelete;
