
// JWT token utilities for session management
export interface JWTPayload {
  username: string;
  role: string;
  session_id: string;
  exp: number;
  iat: number;
  department?: string;
  employee_id?: string;
}

export const generateJWTToken = (username: string, role: string = 'admin'): string => {
  const sessionId = localStorage.getItem('session_id') || 'sess_' + Math.random().toString(36).substr(2, 16);
  
  const payload: JWTPayload = {
    username,
    role,
    session_id: sessionId,
    department: 'AIIMS_ADMIN',
    employee_id: 'EMP_' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (3600 * 8) // 8 hours
  };

  // Simple JWT-like token (base64 encoded)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(Math.random().toString(36)); // Fake signature
  
  return `${header}.${encodedPayload}.${signature}`;
};

export const verifyJWTToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

export const refreshJWTToken = (token: string): string | null => {
  const payload = verifyJWTToken(token);
  if (!payload) return null;
  
  return generateJWTToken(payload.username, payload.role);
};

export const extractSessionFromToken = (token: string): string | null => {
  const payload = verifyJWTToken(token);
  return payload?.session_id || null;
};
