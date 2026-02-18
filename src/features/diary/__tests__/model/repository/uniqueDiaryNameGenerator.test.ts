import { IDiaryNameManager } from '@features/diary/services/persistence/diaryPersistenceInterfaces';
import UniqueDiaryNameGenerator from '@features/diary/services/domain/uniqueDiaryNameGenerator';

describe('UniqueDiaryNameGenerator', () => {
  let nameManager: jest.Mocked<IDiaryNameManager>;
  let nameGenerator: UniqueDiaryNameGenerator;
  beforeEach(() => {
    nameManager = {
      hasDiaryName: jest.fn(),
      getDiaryName: jest.fn(),
    } as unknown as jest.Mocked<IDiaryNameManager>;
    nameGenerator = new UniqueDiaryNameGenerator(nameManager);
  });
  it('should generate a unique diary name by appending a number if the base name already exists', () => {
    nameManager.hasDiaryName.mockReturnValueOnce(true).mockReturnValue(false);
    const result = nameGenerator.generate('diary');
    expect(result).toBe('diary1');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(1, 'diary');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(2, 'diary1');
  });
  it('should return the original name if it is unique', () => {
    nameManager.hasDiaryName.mockReturnValue(false);
    const result = nameGenerator.generate('uniqueDiary');
    expect(result).toBe('uniqueDiary');
    expect(nameManager.hasDiaryName).toHaveBeenCalledWith('uniqueDiary');
  });
  it('should return the original name if the key corresponds to the same name', () => {
    nameManager.getDiaryName.mockReturnValue('myDiary');
    const result = nameGenerator.generate('myDiary', 'someKey');
    expect(result).toBe('myDiary');
    expect(nameManager.getDiaryName).toHaveBeenCalledWith('someKey');
  });
  it('should generate a unique name when multiple duplicates exist', () => {
    nameManager.hasDiaryName
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValue(false);
    const result = nameGenerator.generate('diary');
    expect(result).toBe('diary2');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(1, 'diary');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(2, 'diary1');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(3, 'diary2');
  });
  it('should generate a unique name if the name associated with the key differs from the provided name', () => {
    nameManager.getDiaryName.mockReturnValue('oldDiary');
    nameManager.hasDiaryName.mockReturnValueOnce(true).mockReturnValue(false);
    const result = nameGenerator.generate('newDiary', 'someKey');
    expect(result).toBe('newDiary1');
    expect(nameManager.getDiaryName).toHaveBeenCalledWith('someKey');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(1, 'newDiary');
    expect(nameManager.hasDiaryName).toHaveBeenNthCalledWith(2, 'newDiary1');
  });
  it('should throw an error if unable to generate a unique name after many attempts', () => {
    nameManager.hasDiaryName.mockReturnValue(true);
    expect(() => {
      nameGenerator.generate('diary');
    }).toThrow('Unable to generate a unique diary name.');
  });
});
