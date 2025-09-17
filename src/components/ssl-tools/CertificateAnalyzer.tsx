import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Upload, FileText, Calendar, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateInfo {
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  version: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  keySize: string;
  fingerprint: string;
  isValid: boolean;
}

export const CertificateAnalyzer = () => {
  const [certificate, setCertificate] = useState('');
  const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeCertificate = async () => {
    if (!certificate.trim()) {
      toast({
        title: "Error",
        description: "Please paste a certificate to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate certificate analysis (in real app, this would parse the actual certificate)
    setTimeout(() => {
      const mockCertInfo: CertificateInfo = {
        subject: "CN=example.com, O=Example Corp, L=San Francisco, ST=CA, C=US",
        issuer: "CN=DigiCert SHA2 Secure Server CA, O=DigiCert Inc, C=US",
        serialNumber: "0x1234567890abcdef",
        validFrom: "2024-01-01T00:00:00Z",
        validTo: "2025-01-01T00:00:00Z",
        version: "3",
        signatureAlgorithm: "SHA256withRSA",
        publicKeyAlgorithm: "RSA",
        keySize: "2048 bits",
        fingerprint: "SHA256: 1a:2b:3c:4d:5e:6f:7a:8b:9c:0d:1e:2f:3a:4b:5c:6d",
        isValid: new Date() < new Date("2025-01-01")
      };
      
      setCertInfo(mockCertInfo);
      setIsAnalyzing(false);
      toast({
        title: "Success",
        description: "Certificate analyzed successfully",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card border-border">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Certificate Analyzer</CardTitle>
          </div>
          <CardDescription>
            Paste your X.509 certificate (PEM format) to analyze its details and validity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
...
-----END CERTIFICATE-----"
            className="font-mono min-h-[200px] bg-muted/50"
            value={certificate}
            onChange={(e) => setCertificate(e.target.value)}
          />
          <Button 
            onClick={analyzeCertificate} 
            disabled={isAnalyzing}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Certificate'}
          </Button>
        </CardContent>
      </Card>

      {certInfo && (
        <Card className="bg-gradient-card shadow-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Certificate Details</span>
              </CardTitle>
              <StatusBadge variant={certInfo.isValid ? "success" : "destructive"}>
                {certInfo.isValid ? "Valid" : "Expired"}
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Subject</span>
                </div>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {certInfo.subject}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Issuer</span>
                </div>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {certInfo.issuer}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Valid From</span>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {new Date(certInfo.validFrom).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Valid To</span>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {new Date(certInfo.validTo).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Serial Number</span>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {certInfo.serialNumber}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Signature Algorithm</span>
                <p className="text-sm font-mono text-muted-foreground">
                  {certInfo.signatureAlgorithm}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Public Key</span>
                <p className="text-sm font-mono text-muted-foreground">
                  {certInfo.publicKeyAlgorithm} ({certInfo.keySize})
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Version</span>
                <p className="text-sm font-mono text-muted-foreground">
                  {certInfo.version}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">SHA256 Fingerprint</span>
              <p className="text-sm font-mono text-muted-foreground break-all bg-muted/50 p-2 rounded">
                {certInfo.fingerprint}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};