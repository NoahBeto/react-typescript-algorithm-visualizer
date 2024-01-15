// Overlay.tsx
import React from "react";
import "./OverlayDisable.css"; // Add styling for the overlay

interface OverlayProps {
  show: boolean;
}

const OverlayDisable: React.FC<OverlayProps> = ({ show }) => {
  return show ? <div className="overlay"></div> : null;
};

export default OverlayDisable;
