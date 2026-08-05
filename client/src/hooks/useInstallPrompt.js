import { useEffect, useState, useCallback } from "react";

const isIOSDevice = () => {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export function useInstallPrompt() {

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(isStandalone());
  const [isIOS] = useState(isIOSDevice());

  useEffect(() => {

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return null;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    // The saved event can only be used once, accepted or not —
    // clear it either way so the button reflects reality.
    setDeferredPrompt(null);

    return outcome;
  }, [deferredPrompt]);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    promptInstall
  };
}