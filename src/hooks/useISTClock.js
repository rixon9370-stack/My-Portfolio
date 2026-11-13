import { useState, useEffect } from 'react';

export function useISTClock() {
  const [timeStr, setTimeStr] = useState('00:00:00 AM');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        setTimeStr(formatted);
      } catch (e) {
        const d = new Date();
        setTimeStr(d.toTimeString().split(' ')[0]);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeStr;
}
