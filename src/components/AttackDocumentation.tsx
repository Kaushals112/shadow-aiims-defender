
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Database, 
  FileText, 
  Shield, 
  Code,
  Bug,
  Upload,
  Search
} from 'lucide-react';

const AttackDocumentation = () => {
  const attackVectors = [
    {
      id: 'sql_injection',
      title: 'SQL Injection',
      icon: Database,
      severity: 'Critical',
      description: 'Malicious SQL statements inserted into application queries',
      examples: [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM admin_users --",
        "admin'--",
        "' OR 1=1#"
      ],
      vulnerable_endpoints: [
        'Patient Search Form',
        'Database Query Interface',
        'Login Form Username Field'
      ],
      detection_patterns: [
        "Contains single quotes (')",
        "SQL keywords (SELECT, UNION, DROP, INSERT)",
        "Comment markers (-- or #)",
        "Boolean logic (OR, AND with = conditions)"
      ],
      json_output: {
        "session_id": "sess_abc123",
        "attacker_ip": "192.168.1.100",
        "attack_type": "sql_injection_attempt",
        "payload": "' OR '1'='1",
        "field": "search_query",
        "timestamp": "2024-01-15T10:30:00Z",
        "additional_data": {
          "query_length": 12,
          "contains_keywords": ["OR"],
          "risk_level": "high"
        }
      }
    },
    {
      id: 'xss',
      title: 'Cross-Site Scripting (XSS)',
      icon: Code,
      severity: 'High',
      description: 'Injection of malicious scripts into web pages viewed by other users',
      examples: [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "javascript:alert('XSS')",
        "<svg onload=alert('XSS')>",
        "<iframe src=javascript:alert('XSS')></iframe>"
      ],
      vulnerable_endpoints: [
        'Search Results Display',
        'Report Content Field',
        'Any User Input Reflection'
      ],
      detection_patterns: [
        "Contains <script> tags",
        "Contains javascript: protocol",
        "HTML event handlers (onload, onerror, onclick)",
        "Contains <iframe>, <img>, <svg> with malicious attributes"
      ],
      json_output: {
        "session_id": "sess_def456",
        "attacker_ip": "10.0.0.50",
        "attack_type": "xss_attempt",
        "payload": "<script>alert('XSS')</script>",
        "field": "search_query",
        "timestamp": "2024-01-15T10:35:00Z",
        "additional_data": {
          "payload_length": 29,
          "contains_script_tag": true,
          "risk_level": "high"
        }
      }
    },
    {
      id: 'file_upload',
      title: 'Malicious File Upload',
      icon: Upload,
      severity: 'Critical',
      description: 'Upload of malicious files to gain unauthorized access or execute code',
      examples: [
        "shell.php",
        "backdoor.jsp",
        "malware.exe",
        "script.bat",
        "webshell.asp"
      ],
      vulnerable_endpoints: [
        'Medical Report Upload',
        'Document Attachment Feature'
      ],
      detection_patterns: [
        "Executable extensions (.exe, .bat, .cmd, .scr)",
        "Server-side script files (.php, .jsp, .asp)",
        "Files with double extensions",
        "Suspicious MIME types"
      ],
      json_output: {
        "session_id": "sess_ghi789",
        "attacker_ip": "172.16.0.25",
        "attack_type": "malicious_file_upload",
        "filename": "shell.php",
        "file_type": "text/plain",
        "file_size": 2048,
        "timestamp": "2024-01-15T10:40:00Z",
        "additional_data": {
          "is_executable": true,
          "extension": ".php",
          "risk_level": "critical"
        }
      }
    },
    {
      id: 'brute_force',
      title: 'Brute Force Attack',
      icon: Shield,
      severity: 'High',
      description: 'Systematic attempts to gain access by trying multiple password combinations',
      examples: [
        "admin/admin",
        "admin/password",
        "admin/123456",
        "root/root",
        "administrator/admin"
      ],
      vulnerable_endpoints: [
        'Login Form',
        'Administrative Access Points'
      ],
      detection_patterns: [
        "Multiple failed login attempts",
        "Same IP with different usernames",
        "Rapid successive login attempts",
        "Common username/password combinations"
      ],
      json_output: {
        "session_id": "sess_jkl012",
        "attacker_ip": "203.0.113.100",
        "attack_type": "brute_force_detected",
        "username": "admin",
        "attempt_count": 15,
        "timeframe": "5_minutes",
        "timestamp": "2024-01-15T10:45:00Z",
        "additional_data": {
          "failed_attempts": 15,
          "success_rate": 0,
          "risk_level": "high"
        }
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AIIMS Honeypot - Attack Vector Documentation
        </h1>
        <p className="text-gray-600">
          Comprehensive guide to detected attack patterns and their analysis
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Attack Overview</TabsTrigger>
          <TabsTrigger value="vectors">Attack Vectors</TabsTrigger>
          <TabsTrigger value="json">JSON Output Format</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {attackVectors.map((attack) => {
              const IconComponent = attack.icon;
              return (
                <Card key={attack.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                      <Badge className={getSeverityColor(attack.severity)}>
                        {attack.severity}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{attack.title}</h3>
                    <p className="text-sm text-gray-600">{attack.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="vectors" className="space-y-6">
          {attackVectors.map((attack) => {
            const IconComponent = attack.icon;
            return (
              <Card key={attack.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    {attack.title}
                    <Badge className={getSeverityColor(attack.severity)}>
                      {attack.severity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Example Payloads</h4>
                        <div className="bg-gray-100 p-3 rounded-lg space-y-1">
                          {attack.examples.map((example, index) => (
                            <code key={index} className="block text-sm text-red-600 break-all">
                              {example}
                            </code>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Vulnerable Endpoints</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {attack.vulnerable_endpoints.map((endpoint, index) => (
                            <li key={index} className="text-sm text-gray-600">{endpoint}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Detection Patterns</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {attack.detection_patterns.map((pattern, index) => (
                          <li key={index} className="text-sm text-gray-600">{pattern}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="json" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>JSON Output Format Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {attackVectors.map((attack) => (
                  <div key={attack.id}>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <attack.icon className="w-4 h-4" />
                      {attack.title} - JSON Output
                    </h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      {JSON.stringify(attack.json_output, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttackDocumentation;
