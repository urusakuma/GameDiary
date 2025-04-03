import { IDiaryNameManager } from '@/model/repository/diaryRepositoryInterfaces';
import { UniqueDiaryNameGenerator } from '@/model/repository/uniqueDiaryNameGenerator';

describe('UniqueDiaryNameGenerator', () => {
  let nameManager: jest.Mocked<IDiaryNameManager>;
  let nameGenerator: UniqueDiaryNameGenerator;
  beforeEach(() => {
    nameManager = {
      isIncludeDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiaryNameManager>;
    nameGenerator = new UniqueDiaryNameGenerator(nameManager);
  });
  it('should generate a unique diary name by appending a number if the base name already exists', () => {
    nameManager.isIncludeDiaryName
      .mockReturnValueOnce(true)
      .mockReturnValue(false);
    const result = nameGenerator.generate('diary');
    expect(result).toBe('diary1');
    expect(nameManager.isIncludeDiaryName).toHaveBeenNthCalledWith(1, 'diary');
    expect(nameManager.isIncludeDiaryName).toHaveBeenNthCalledWith(2, 'diary1');
  });
});
