import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Globe, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TLSResult {
  domain: string;
  port: number;
  protocols: {
    version: string;
    supported: boolean;
    cipher: string;
    secure: boolean;
  }[];
  certificate: {
    subject: string;
    issuer: string;
    validUntil: string;
    isValid: boolean;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export const TLSChecker = () => {
  const [domain, setDomain] = useState('');
  const [port, setPort] = useState('443');
  const [tlsResult, setTlsResult] = useState<TLSResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkTLS = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain to check",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate TLS checking (in real app, this would use actual TLS testing)
    setTimeout(() => {
      const mockResult: TLSResult = {
        domain: domain,
        port: parseInt(port),
        protocols: [
          { version: 'TLS 1.3', supported: true, cipher: 'TLS_AES_256_GCM_SHA384', secure: true },
          { version: 'TLS 1.2', supported: true, cipher: 'ECDHE-RSA-AES256-GCM-SHA384', secure: true },
          { version: 'TLS 1.1', supported: false, cipher: '', secure: false },
          { version: 'TLS 1.0', supported: false, cipher: '', secure: false },
          { version: 'SSL 3.0', supported: false, cipher: '', secure: false },
        ],
        certificate: {
          subject: `CN=${domain}`,
          issuer: 'CN=DigiCert SHA2 Secure Server CA',
          validUntil: '2025-12-31T23:59:59Z',
          isValid: true
        },
        grade: 'A'
      };
      
      setTlsResult(mockResult);
      setIsChecking(false);
      toast({
        title: "Success",
        description: `TLS check completed for ${domain}`,
      });
    }, 2000);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'success';
      case 'B': return 'warning';
      case 'C':
      case 'D':
      case 'F': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card border-border">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>TLS/SSL Checker</CardTitle>
          </div>
          <CardDescription>
            Test SSL/TLS configuration and supported protocols for any domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="443"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-20"
            />
          </div>
          <Button 
            onClick={checkTLS} 
            disabled={isChecking}
            className="w-full"
          >
            <Shield className="mr-2 h-4 w-4" />
            {isChecking ? 'Checking TLS...' : 'Check TLS Configuration'}
          </Button>
        </CardContent>
      </Card>

      {tlsResult && (
        <div className="space-y-6">
          <Card className="bg-gradient-card shadow-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>TLS Configuration for {tlsResult.domain}:{tlsResult.port}</span>
                </CardTitle>
                <StatusBadge variant={getGradeColor(tlsResult.grade)}>
                  Grade: {tlsResult.grade}
                </StatusBadge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Supported Protocols</h4>
                  <div className="space-y-2">
                    {tlsResult.protocols.map((protocol, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {protocol.supported ? 
                            <CheckCircle className="h-4 w-4 text-success" /> : 
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          }
                          <span className="font-mono text-sm">{protocol.version}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {protocol.supported && (
                            <>
                              <span className="text-xs font-mono text-muted-foreground">
                                {protocol.cipher}
                              </span>
                              <StatusBadge 
                                variant={protocol.secure ? "success" : "warning"}
                                className="text-xs"
                              >
                                {protocol.secure ? "Secure" : "Weak"}
                              </StatusBadge>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Certificate Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="text-xs text-muted-foreground">Subject</span>
                      <p className="font-mono text-sm">{tlsResult.certificate.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Issuer</span>
                      <p className="font-mono text-sm">{tlsResult.certificate.issuer}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Valid Until</span>
                      <p className="font-mono text-sm">
                        {new Date(tlsResult.certificate.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Status</span>
                      <div className="mt-1">
                        <StatusBadge variant={tlsResult.certificate.isValid ? "success" : "destructive"}>
                          {tlsResult.certificate.isValid ? "Valid" : "Invalid"}
                        </StatusBadge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};