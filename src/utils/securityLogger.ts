
// Security logging utility for honeypot
export interface AttackLog {
  session_id: string;
  attacker_ip: string;
  attack_type: string;
  payload?: string;
  timestamp: string;
  user_agent: string;
  page: string;
  additional_data?: any;
}

export const generateSessionId = (): string => {
  return 'sess_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
};

export const getAttackerIP = async (): Promise<string> => {
  try {
    // In a real honeypot, this would capture the actual IP
    // For demo purposes, we'll simulate it
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // Fallback to a simulated IP
    return '192.168.1.' + Math.floor(Math.random() * 254 + 1);
  }
};

export const logActivity = async (attackType: string, additionalData: any = {}) => {
  const sessionId = localStorage.getItem('session_id') || generateSessionId();
  const attackerIP = await getAttackerIP();
  
  const logEntry: AttackLog = {
    session_id: sessionId,
    attacker_ip: attackerIP,
    attack_type: attackType,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    page: window.location.pathname,
    payload: additionalData.payload,
    additional_data: additionalData
  };

  // Store in localStorage for demo (in real implementation, this would go to dionaea)
  const existingLogs = JSON.parse(localStorage.getItem('attack_logs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('attack_logs', JSON.stringify(existingLogs));
  
  // Also store in sessionStorage for current session tracking
  const sessionLogs = JSON.parse(sessionStorage.getItem('session_attacks') || '[]');
  sessionLogs.push(logEntry);
  sessionStorage.setItem('session_attacks', JSON.stringify(sessionLogs));

  // Log to console for monitoring
  console.log('🚨 Attack Detected:', logEntry);
  
  // Simulate saving to dionaea directory
  console.log(`📁 Logged to: /usr/local/var/lib/dionaea/ftp/root/logs/${sessionId}.json`);
  
  return logEntry;
};

export const getSessionLogs = (): AttackLog[] => {
  return JSON.parse(localStorage.getItem('attack_logs') || '[]');
};

export const getSessionAttacks = (): AttackLog[] => {
  return JSON.parse(sessionStorage.getItem('session_attacks') || '[]');
};

// Obfuscated JavaScript function (simulated)
export const obfuscateJavaScript = (code: string): string => {
  // This is a simple obfuscation simulation
  return btoa(code).split('').reverse().join('');
};

// Page visit tracking
export const trackPageVisit = (page: string) => {
  logActivity('page_visit', { 
    page,
    referrer: document.referrer,
    timestamp: new Date().toISOString()
  });
};

// Brute force detection
export const detectBruteForce = (username: string): boolean => {
  const attempts = JSON.parse(localStorage.getItem('login_attempts') || '[]');
  const recentAttempts = attempts.filter((attempt: any) => 
    attempt.username === username && 
    Date.now() - new Date(attempt.timestamp).getTime() < 300000 // 5 minutes
  );
  
  if (recentAttempts.length >= 5) {
    logActivity('brute_force_detected', {
      username,
      attempt_count: recentAttempts.length,
      timeframe: '5_minutes'
    });
    return true;
  }
  
  return false;
};

// XSS payload detection
export const detectXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*onerror/gi,
    /<iframe/gi,
    /document\.cookie/gi,
    /eval\(/gi,
    /alert\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// SQL injection detection
export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /('|(\\'))|(;|--|\||\/\*|\*\/)/gi,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/gi,
    /(\b(union|select|insert|delete|update|drop|create|alter|exec|execute)\b)/gi,
    /'.*or.*'.*=.*'/gi,
    /'.*and.*'.*=.*'/gi,
    /\b(or|and)\b\s+\d+\s*=\s*\d+/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// Initialize tracking
if (typeof window !== 'undefined') {
  // Track initial page load
  window.addEventListener('load', () => {
    trackPageVisit(window.location.pathname);
  });
  
  // Track navigation
  window.addEventListener('popstate', () => {
    trackPageVisit(window.location.pathname);
  });
}
