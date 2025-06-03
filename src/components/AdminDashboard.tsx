
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Activity, 
  Upload, 
  Search,
  Shield,
  Database,
  Settings,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { logActivity } from '../utils/securityLogger';

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 45, diagnosis: 'Hypertension', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 32, diagnosis: 'Diabetes', status: 'Discharged' },
  ]);

  useEffect(() => {
    logActivity('dashboard_access', { timestamp: new Date().toISOString() });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log XSS attempt detection
    if (searchQuery.includes('<script>') || searchQuery.includes('javascript:') || 
        searchQuery.includes('<img') || searchQuery.includes('onerror=')) {
      logActivity('xss_attempt', {
        payload: searchQuery,
        field: 'search',
        timestamp: new Date().toISOString()
      });
    }

    // Vulnerable search - simulate SQL injection
    if (searchQuery.includes("'") || searchQuery.includes('"') || 
        searchQuery.includes('UNION') || searchQuery.includes('SELECT')) {
      logActivity('sql_injection_attempt', {
        payload: searchQuery,
        field: 'search_query',
        timestamp: new Date().toISOString()
      });
    }

    logActivity('search_performed', { query: searchQuery });
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log XSS attempts in report content
    if (reportContent.includes('<script>') || reportContent.includes('javascript:') || 
        reportContent.includes('<img') || reportContent.includes('onerror=')) {
      logActivity('xss_attempt', {
        payload: reportContent,
        field: 'report_content',
        timestamp: new Date().toISOString()
      });
    }

    logActivity('report_submission', {
      content_length: reportContent.length,
      has_file: !!selectedFile,
      timestamp: new Date().toISOString()
    });

    // Simulate saving to dionaea directory
    console.log('Report saved to /usr/local/var/lib/dionaea/ftp/root/reports/');
    setReportContent('');
    setSelectedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      logActivity('file_upload_attempt', {
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        timestamp: new Date().toISOString()
      });

      // Log potentially malicious files
      const maliciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.php', '.jsp', '.asp'];
      const isMalicious = maliciousExtensions.some(ext => file.name.toLowerCase().includes(ext));
      
      if (isMalicious) {
        logActivity('malicious_file_upload', {
          filename: file.name,
          file_type: file.type,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleLogout = () => {
    logActivity('logout', { timestamp: new Date().toISOString() });
    localStorage.removeItem('auth_token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AIIMS Administrative Portal</h1>
                <p className="text-sm text-gray-500">Healthcare Management System v2.1</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                System Online
              </Badge>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reports Today</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Secure</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patient Management</TabsTrigger>
            <TabsTrigger value="reports">Medical Reports</TabsTrigger>
            <TabsTrigger value="database">Database Query</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Patient Management Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Patient Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-4">
                  <Input
                    placeholder="Search patients by name, ID, or diagnosis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">Search</Button>
                </form>
                
                {/* Display search results with XSS vulnerability */}
                {searchQuery && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Search results for:</p>
                    <div 
                      className="font-medium" 
                      dangerouslySetInnerHTML={{ __html: searchQuery }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Patient ID</th>
                        <th className="border border-gray-300 p-3 text-left">Name</th>
                        <th className="border border-gray-300 p-3 text-left">Age</th>
                        <th className="border border-gray-300 p-3 text-left">Diagnosis</th>
                        <th className="border border-gray-300 p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="border border-gray-300 p-3">{patient.id}</td>
                          <td className="border border-gray-300 p-3">{patient.name}</td>
                          <td className="border border-gray-300 p-3">{patient.age}</td>
                          <td className="border border-gray-300 p-3">{patient.diagnosis}</td>
                          <td className="border border-gray-300 p-3">
                            <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                              {patient.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Medical Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Content</label>
                    <Textarea
                      placeholder="Enter medical report details..."
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Attach File</label>
                    <Input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Query Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SQL Query</label>
                    <Textarea
                      placeholder="SELECT * FROM patients WHERE ..."
                      rows={4}
                      onChange={(e) => {
                        const query = e.target.value;
                        if (query.includes("'") || query.includes('"') || 
                            query.includes('DROP') || query.includes('DELETE') ||
                            query.includes('UPDATE') || query.includes('INSERT')) {
                          logActivity('sql_injection_attempt', {
                            payload: query,
                            field: 'database_query',
                            timestamp: new Date().toISOString()
                          });
                        }
                      }}
                    />
                  </div>
                  <Button>Execute Query</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Server Host</label>
                      <Input defaultValue="172.16.10.5" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Database Port</label>
                      <Input defaultValue="3306" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <Input defaultValue="admin@aiims.edu" />
                  </div>
                  <Button>Save Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
