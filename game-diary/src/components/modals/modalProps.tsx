export enum modal {
  Home,
  Export,
  Import,
  Load,
  Delete,
  Create,
}

export interface ModalProps {
  onNavigate: (modal: modal) => void;
  isDarkMode: boolean;
}
