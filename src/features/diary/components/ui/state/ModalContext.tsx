import { createContext, useContext, useEffect, useRef, useState } from 'react';

import ContextWrapperProps from '@shared/components/contextWrapperProps';
import CreateModal from '@features/diary/components/modals/CreateModal';
import DeleteModal from '@features/diary/components/modals/DeleteModal';
import ExportModal from '@features/diary/components/modals/ExportModal';
import ImportModal from '@features/diary/components/modals/ImportModal';
import LoadModal from '@features/diary/components/modals/LoadModal';

enum Modal {
  Home,
  Export,
  Import,
  Load,
  Delete,
  Create,
}

type EachModalFunction<T> = {
  home: () => T;
  export: () => T;
  import: () => T;
  load: () => T;
  create: () => T;
  delete: () => T;
};

export type KeyboardEventHandler = (
  e: KeyboardEvent,
  isModal: EachModalFunction<boolean>
) => void;

type ShortcutType = (e: KeyboardEventHandler) => () => void;
type ModalContexttype = {
  go: EachModalFunction<void>;
  shortcutRegister: ShortcutType;
};

const ModalContext = createContext<ModalContexttype | null>(null);

export const ModalProvider = ({ children }: ContextWrapperProps) => {
  const [showModal, setShowModal] = useState(Modal.Home);
  const handlers = useRef<Array<KeyboardEventHandler>>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handlers.current.forEach((fn) => fn(e, isModal));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const shortcutRegister = (fn: KeyboardEventHandler) => {
    handlers.current.push(fn);
    return () => {
      handlers.current = handlers.current.filter((h) => h !== fn);
    };
  };
  const isModal = {
    home: () => showModal === Modal.Home,
    export: () => showModal === Modal.Export,
    import: () => showModal === Modal.Import,
    load: () => showModal === Modal.Load,
    create: () => showModal === Modal.Create,
    delete: () => showModal === Modal.Delete,
  };
  const go = {
    home: () => setShowModal(Modal.Home),
    export: () => setShowModal(Modal.Export),
    import: () => setShowModal(Modal.Import),
    load: () => setShowModal(Modal.Load),
    create: () => setShowModal(Modal.Create),
    delete: () => setShowModal(Modal.Delete),
  };
  const moveModalObj = { go, shortcutRegister };
  return (
    <ModalContext.Provider value={moveModalObj}>
      {children}
      {showModal === Modal.Export && <ExportModal />}
      {showModal === Modal.Import && <ImportModal />}
      {showModal === Modal.Create && <CreateModal />}
      {showModal === Modal.Delete && <DeleteModal />}
      {showModal === Modal.Load && <LoadModal />}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error(
      'useMoveModalContext must be used within a MoveModalProvider'
    );
  }
  return context;
};
