import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Backdrop } from "./Backdrop";
import { useBackButtonClose } from "../hooks/useBackButtonClose";

function MenuPortal({
  anchorRef,
  isOpen,
  width = 170,
  children,
  onClose
}) {

  useBackButtonClose(isOpen, onClose);

  const [position, setPosition] = useState({
    top: 0,
    left: 0
  });

  useLayoutEffect(() => {

    if (!isOpen || !anchorRef.current) {
      return;
    }

    const updatePosition = () => {

      const rect =
        anchorRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 8,
        left: rect.right - width
      });

    };

    updatePosition();

    window.addEventListener(
      "resize",
      updatePosition
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {

      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );

    };

  }, [
    isOpen,
    anchorRef,
    width
  ]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <Backdrop onClose={onClose} />

      <div
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width,
          zIndex: 10000
        }}
      >
        {children}
      </div>
    </>,
    document.body
  );

}

export default MenuPortal;