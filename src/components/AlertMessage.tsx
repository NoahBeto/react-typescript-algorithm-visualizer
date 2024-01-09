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
          <div className="modal-content-upper">
            <span>&times;</span>
            <span className="close" onClick={onClose}>
              &times;
            </span>
          </div>
          <div className="modal-content-lower">
            <span>Error...</span>
            <span className="modal-message">{message}</span>
            <button onClick={onClose}>Try Again</button>
          </div>
        </div>
      </div>
    </>
  );
};
