import { useEffect, useRef } from "react";
import { registerOverlay, unregisterOverlay } from "../utils/overlayManager";

export function useBackButtonClose(isOpen, onClose) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const id = registerOverlay(onCloseRef);

    return () => {
      unregisterOverlay(id);
    };
  }, [isOpen]);
}