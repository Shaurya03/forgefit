import { createPortal } from "react-dom";
import "./Backdrop.css";

export function Backdrop({ onClose }) {
  const handlePointerStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.defaultPrevented) return;

    onClose();
  };

  return createPortal(
    <div
      className="menu-backdrop"
      onMouseDown={handlePointerStart}
      onTouchStart={handlePointerStart}
      onClick={handleClose}
      onTouchEnd={handleClose}
    />,
    document.body
  );
}