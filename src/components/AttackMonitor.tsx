
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Database, 
  FileText,
  Activity,
  Clock,
  MapPin
} from 'lucide-react';
import { AttackLog, getSessionLogs } from '../utils/securityLogger';

const AttackMonitor = () => {
  const [logs, setLogs] = useState<AttackLog[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');

  useEffect(() => {
    const updateLogs = () => {
      const allLogs = getSessionLogs();
      setLogs(allLogs);
    };

    updateLogs();
    const interval = setInterval(updateLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const sessions = [...new Set(logs.map(log => log.session_id))];
  const filteredLogs = selectedSession 
    ? logs.filter(log => log.session_id === selectedSession)
    : logs;

  const attackTypes = {
    'sql_injection_attempt': { icon: Database, color: 'bg-red-500', label: 'SQL Injection' },
    'xss_attempt': { icon: AlertTriangle, color: 'bg-orange-500', label: 'XSS Attack' },
    'login_attempt': { icon: Shield, color: 'bg-blue-500', label: 'Login Attempt' },
    'brute_force_detected': { icon: Shield, color: 'bg-red-600', label: 'Brute Force' },
    'file_upload_attempt': { icon: FileText, color: 'bg-purple-500', label: 'File Upload' },
    'malicious_file_upload': { icon: AlertTriangle, color: 'bg-red-600', label: 'Malicious File' },
    'page_visit': { icon: Eye, color: 'bg-green-500', label: 'Page Visit' },
    'search_performed': { icon: Activity, color: 'bg-blue-400', label: 'Search' },
    'dashboard_access': { icon: Activity, color: 'bg-green-400', label: 'Dashboard Access' }
  };

  const getAttackTypeInfo = (type: string) => {
    return attackTypes[type as keyof typeof attackTypes] || {
      icon: Activity,
      color: 'bg-gray-500',
      label: type
    };
  };

  const groupedBySeverity = {
    critical: logs.filter(log => ['sql_injection_attempt', 'brute_force_detected', 'malicious_file_upload'].includes(log.attack_type)),
    warning: logs.filter(log => ['xss_attempt', 'login_attempt'].includes(log.attack_type)),
    info: logs.filter(log => ['page_visit', 'search_performed', 'dashboard_access', 'file_upload_attempt'].includes(log.attack_type))
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AIIMS Honeypot - Attack Monitor
          </h1>
          <p className="text-gray-600">
            Real-time monitoring of security events and attacker behavior
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Attacks</p>
                  <p className="text-2xl font-bold text-red-600">{logs.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Threats</p>
                  <p className="text-2xl font-bold text-red-600">{groupedBySeverity.critical.length}</p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Activity</p>
                  <p className="text-sm font-bold text-gray-900">
                    {logs.length > 0 ? new Date(logs[logs.length - 1].timestamp).toLocaleTimeString() : 'None'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="sessions">Session Analysis</TabsTrigger>
            <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          </TabsList>

          {/* Live Feed */}
          <TabsContent value="live" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Real-time Attack Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredLogs.slice().reverse().map((log, index) => {
                    const attackInfo = getAttackTypeInfo(log.attack_type);
                    const IconComponent = attackInfo.icon;
                    
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg bg-white">
                        <div className={`p-2 rounded-full ${attackInfo.color}`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{attackInfo.label}</Badge>
                            <Badge variant="secondary" className="text-xs">
                              {log.session_id.slice(-8)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p><strong>IP:</strong> {log.attacker_ip}</p>
                            <p><strong>Page:</strong> {log.page}</p>
                            {log.payload && (
                              <p><strong>Payload:</strong> 
                                <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                  {log.payload.substring(0, 100)}
                                  {log.payload.length > 100 ? '...' : ''}
                                </code>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session Analysis */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session-based Attack Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Session List */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Active Sessions</h3>
                    {sessions.map((sessionId) => {
                      const sessionLogs = logs.filter(log => log.session_id === sessionId);
                      const lastActivity = sessionLogs[sessionLogs.length - 1];
                      
                      return (
                        <Button
                          key={sessionId}
                          variant={selectedSession === sessionId ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedSession(sessionId)}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-mono text-xs">{sessionId.slice(-12)}</span>
                            <span className="text-xs text-gray-500">
                              {sessionLogs.length} events | {lastActivity?.attacker_ip}
                            </span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Session Details */}
                  <div className="lg:col-span-2">
                    {selectedSession && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-gray-900">
                          Session Details: {selectedSession.slice(-12)}
                        </h3>
                        <div className="space-y-2">
                          {logs
                            .filter(log => log.session_id === selectedSession)
                            .map((log, index) => {
                              const attackInfo = getAttackTypeInfo(log.attack_type);
                              
                              return (
                                <div key={index} className="flex items-center gap-3 p-3 border rounded">
                                  <Badge variant="outline" className="text-xs">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </Badge>
                                  <Badge className={`text-xs ${attackInfo.color}`}>
                                    {attackInfo.label}
                                  </Badge>
                                  <span className="text-sm text-gray-600">{log.page}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Threat Intelligence */}
          <TabsContent value="threats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Critical Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {groupedBySeverity.critical.map((log, index) => (
                      <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-red-600">{getAttackTypeInfo(log.attack_type).label}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm"><strong>IP:</strong> {log.attacker_ip}</p>
                        <p className="text-sm"><strong>Session:</strong> {log.session_id.slice(-8)}</p>
                        {log.payload && (
                          <p className="text-xs bg-white p-2 rounded mt-2 font-mono">
                            {log.payload.substring(0, 150)}...
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Warnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {groupedBySeverity.warning.map((log, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <Badge className="bg-orange-600">{getAttackTypeInfo(log.attack_type).label}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm"><strong>IP:</strong> {log.attacker_ip}</p>
                        <p className="text-sm"><strong>Page:</strong> {log.page}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttackMonitor;
