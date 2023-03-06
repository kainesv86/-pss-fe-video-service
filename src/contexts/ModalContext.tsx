import * as React from 'react';

export interface IModalItem {
  value: any;
  priority: number;
  isOpen: boolean;
}

export interface IModalContext {
  modal: Record<string, IModalItem>;
  handleModal: (key: string, value: any) => void;
  handleOpenModal: (key: string) => void;
  handleCloseModal: (key: string) => void;
  handleDestroy: () => void;
}

export const ModalContext = React.createContext<IModalContext>({
  modal: {},
  handleModal: () => {},
  handleOpenModal: () => {},
  handleCloseModal: () => {},
  handleDestroy: () => {},
});

interface ModalProviderProps {}

export const ModalProvider: React.FunctionComponent<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = React.useState<Record<string, IModalItem>>({});

  const handleModal = (key: string, value: any) => {
    setModal(prev => ({
      ...prev,
      [key]: {
        priority: Object.keys(prev).length + 1,
        value,
        isOpen: false,
      },
    }));
  };

  const handleOpenModal = (key: string) => {
    setModal(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isOpen: true,
      },
    }));
  };

  const handleCloseModal = (key: string) => {
    setModal(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isOpen: false,
      },
    }));
  };

  const handleDestroy = () => {
    setModal({});
  };

  return (
    <ModalContext.Provider
      value={{
        modal,
        handleModal,
        handleOpenModal,
        handleCloseModal,
        handleDestroy,
      }}
    >
      <div className="relative z-0">{children}</div>

      {Object.keys(modal).map((key, index) => {
        const { value, isOpen, priority } = modal[key];

        if (!isOpen) {
          return null;
        }

        return (
          <div
            style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100%', zIndex: 10 + priority }}
            key={`modeal-${key}-${index}`}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }} key={key}>
                {value}
              </div>
            </div>
          </div>
        );
      })}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => React.useContext(ModalContext);
