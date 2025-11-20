export interface ModalManagerProps {
   open: (config: ModalConfig) => void;
   hide: () => void;
}

export interface ModalConfig {
   title?: string;
   action?: ModalAction[];
   content: React.ReactNode;
}

export interface ModalAction {
   id: string;
   label: string;
   onClick: () => void;
}
