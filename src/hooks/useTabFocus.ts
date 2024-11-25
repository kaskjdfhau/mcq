import { useEffect } from 'react';

export function useTabFocus(onTabChange: (hidden: boolean) => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      onTabChange(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onTabChange]);
}