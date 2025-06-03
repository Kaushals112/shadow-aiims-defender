
// Code obfuscation utility to hide frontend implementation
export const obfuscatedConfig = {
  // Encoded configuration
  apiEndpoint: atob('aHR0cHM6Ly9haWltcy5nb3YuaW4vYXBp'),
  version: atob('djIuMS4w'),
  department: atob('bWluaXN0cnktb2YtaGVhbHRo'),
  
  // Security headers
  headers: {
    'X-AIIMS-Auth': btoa('secure-token-' + Date.now()),
    'X-Gov-Portal': 'true',
    'Content-Type': 'application/json'
  }
};

// Obfuscated logging function
export const secureLog = (() => {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Override console methods to hide development traces
  console.log = (...args) => {
    if (process.env.NODE_ENV === 'development') {
      originalLog.apply(console, args);
    }
  };
  
  console.error = (...args) => {
    if (process.env.NODE_ENV === 'development') {
      originalError.apply(console, args);
    }
  };
  
  console.warn = (...args) => {
    if (process.env.NODE_ENV === 'development') {
      originalWarn.apply(console, args);
    }
  };
  
  return {
    info: (message: string) => {
      // Only log security events, not implementation details
      if (message.includes('🚨') || message.includes('📁')) {
        originalLog(message);
      }
    }
  };
})();

// Obfuscated event tracking
export const trackEvent = (eventType: string, data: any) => {
  const encoded = btoa(JSON.stringify({
    ...data,
    timestamp: Date.now(),
    session: localStorage.getItem('session_id')?.slice(-8)
  }));
  
  // Store encoded data
  sessionStorage.setItem(`evt_${eventType}_${Date.now()}`, encoded);
};

// Anti-debugging measures
export const initAntiDebug = () => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
  
  // Disable F12, Ctrl+Shift+I, Ctrl+U
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.key === 'u')
    ) {
      e.preventDefault();
      return false;
    }
  });
  
  // Basic debugger detection
  setInterval(() => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    
    if (end - start > 100) {
      // Developer tools detected - redirect or show warning
      window.location.href = '/';
    }
  }, 5000);
};
