import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Globe, Clock, Shield, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CTLog {
  id: string;
  timestamp: string;
  issuer: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  serialNumber: string;
}

export const CertificateTransparency = () => {
  const [domain, setDomain] = useState('');
  const [logs, setLogs] = useState<CTLog[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchCTLogs = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate CT log search
    setTimeout(() => {
      const mockLogs: CTLog[] = [
        {
          id: "1",
          timestamp: "2024-01-15T10:30:00Z",
          issuer: "CN=Let's Encrypt Authority X3, O=Let's Encrypt, C=US",
          subject: `CN=${domain}, O=Example Corp`,
          notBefore: "2024-01-01T00:00:00Z",
          notAfter: "2024-04-01T23:59:59Z",
          serialNumber: "0x123456789abcdef0"
        },
        {
          id: "2", 
          timestamp: "2023-10-15T14:20:00Z",
          issuer: "CN=DigiCert SHA2 Secure Server CA, O=DigiCert Inc, C=US",
          subject: `CN=${domain}, O=Example Corp`,
          notBefore: "2023-10-01T00:00:00Z", 
          notAfter: "2024-10-01T23:59:59Z",
          serialNumber: "0xfedcba0987654321"
        }
      ];
      
      setLogs(mockLogs);
      setIsSearching(false);
      toast({
        title: "Success",
        description: `Found ${mockLogs.length} certificates in CT logs`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-card shadow-card border-border hover-scale transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Certificate Transparency Logs</CardTitle>
          </div>
          <CardDescription>
            Search Certificate Transparency logs for certificates issued to a domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && searchCTLogs()}
            />
            <Button 
              onClick={searchCTLogs} 
              disabled={isSearching}
              className="transition-transform duration-200 hover:scale-105"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card className="bg-gradient-card shadow-card border-border animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Certificate Transparency Results</span>
              </CardTitle>
              <StatusBadge variant="success">
                {logs.length} Found
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {logs.map((log, index) => (
              <div 
                key={log.id} 
                className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Logged</span>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Serial Number</span>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {log.serialNumber}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Subject</span>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {log.subject}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Issuer</span>
                    <p className="text-sm font-mono text-muted-foreground break-all">
                      {log.issuer}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Valid Period</span>
                    <p className="text-sm font-mono text-muted-foreground">
                      {new Date(log.notBefore).toLocaleDateString()} - {new Date(log.notAfter).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="h-6 text-primary hover:text-primary-foreground">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View in CT Log
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};