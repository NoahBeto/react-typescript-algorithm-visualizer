import "./AlertMessage.css";

interface AlertMessageProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const AlertMessage = ({
  isOpen,
  onClose,
  message,
}: AlertMessageProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-content">
            <p className="modal-message">{message}</p>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
