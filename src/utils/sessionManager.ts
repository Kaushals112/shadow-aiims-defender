
export interface SessionData {
  session_id: string;
  user_id: string;
  username: string;
  start_time: string;
  end_time?: string;
  last_activity: string;
  status: 'active' | 'expired' | 'logged_out';
  attacker_ip: string;
}

export class SessionManager {
  private static SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static ACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute
  private activityTimer: NodeJS.Timeout | null = null;

  static startSession(username: string, sessionId: string, attackerIp: string): SessionData {
    const session: SessionData = {
      session_id: sessionId,
      user_id: `user_${Date.now()}`,
      username,
      start_time: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      status: 'active',
      attacker_ip: attackerIp
    };

    this.saveSession(session);
    this.startActivityTracking();
    return session;
  }

  static updateActivity(sessionId: string) {
    const sessions = this.getActiveSessions();
    const sessionIndex = sessions.findIndex(s => s.session_id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].last_activity = new Date().toISOString();
      localStorage.setItem('active_sessions', JSON.stringify(sessions));
    }
  }

  static endSession(sessionId: string, reason: 'logout' | 'timeout' = 'logout') {
    const sessions = this.getActiveSessions();
    const sessionIndex = sessions.findIndex(s => s.session_id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].end_time = new Date().toISOString();
      sessions[sessionIndex].status = reason === 'timeout' ? 'expired' : 'logged_out';
      localStorage.setItem('active_sessions', JSON.stringify(sessions));
    }
  }

  static getActiveSessions(): SessionData[] {
    const sessions = JSON.parse(localStorage.getItem('active_sessions') || '[]');
    return sessions.filter((session: SessionData) => session.status === 'active');
  }

  static getAllSessions(): SessionData[] {
    return JSON.parse(localStorage.getItem('active_sessions') || '[]');
  }

  static checkSessionTimeout() {
    const sessions = this.getAllSessions();
    const now = Date.now();
    
    sessions.forEach(session => {
      if (session.status === 'active') {
        const lastActivity = new Date(session.last_activity).getTime();
        if (now - lastActivity > this.SESSION_TIMEOUT) {
          this.endSession(session.session_id, 'timeout');
        }
      }
    });
  }

  static startActivityTracking() {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
    }
    
    this.activityTimer = setInterval(() => {
      this.checkSessionTimeout();
    }, this.ACTIVITY_CHECK_INTERVAL);
  }

  private static saveSession(session: SessionData) {
    const sessions = this.getAllSessions();
    sessions.push(session);
    localStorage.setItem('active_sessions', JSON.stringify(sessions));
  }
}

// Track user activity
export const trackUserActivity = () => {
  const sessionId = localStorage.getItem('session_id');
  if (sessionId) {
    SessionManager.updateActivity(sessionId);
  }
};

// Setup activity listeners
if (typeof window !== 'undefined') {
  ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    window.addEventListener(event, trackUserActivity, { passive: true });
  });

  // Handle tab close/refresh
  window.addEventListener('beforeunload', () => {
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      SessionManager.endSession(sessionId, 'logout');
    }
  });
}
