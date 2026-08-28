import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  // Default to true so we can test the UI in the iframe preview
  const [isInstallable, setIsInstallable] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('App installed successfully!');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Fallback for when we don't have the explicit prompt
      // (like on iOS Safari or inside preview iframes)
      toast.info("To install, use your browser's 'Add to Home Screen' option");
    }
  };

  return { isInstallable, promptInstall };
}
