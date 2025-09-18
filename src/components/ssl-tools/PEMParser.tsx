import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Award, FileText, Upload, Key, Shield, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PEMType = 'auto' | 'certificate' | 'csr' | 'pkcs7' | 'private-key' | 'public-key';

interface ParsedPEM {
  type: string;
  details: Record<string, any>;
  isValid: boolean;
  warning?: string;
}

export const PEMParser = () => {
  const [pemInput, setPemInput] = useState('');
  const [pemType, setPemType] = useState<PEMType>('auto');
  const [parsedData, setParsedData] = useState<ParsedPEM | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const parsePEM = async () => {
    if (!pemInput.trim()) {
      toast({
        title: "Error",
        description: "Please paste PEM data to parse",
        variant: "destructive",
      });
      return;
    }

    setIsParsing(true);

    // Simulate PEM parsing
    setTimeout(() => {
      // Detect PEM type based on headers
      let detectedType = 'unknown';
      let mockData: ParsedPEM;

      if (pemInput.includes('BEGIN CERTIFICATE')) {
        detectedType = 'X.509 Certificate';
        mockData = {
          type: detectedType,
          isValid: true,
          details: {
            version: '3',
            serialNumber: '0x1234567890abcdef',
            subject: 'CN=example.com, O=Example Corp, L=San Francisco, ST=CA, C=US',
            issuer: 'CN=DigiCert SHA2 Secure Server CA, O=DigiCert Inc, C=US',
            validFrom: '2024-01-01T00:00:00Z',
            validTo: '2025-01-01T23:59:59Z',
            signatureAlgorithm: 'SHA256withRSA',
            publicKeyAlgorithm: 'RSA',
            keySize: '2048 bits',
            extensions: ['Subject Alternative Name', 'Key Usage', 'Extended Key Usage', 'Authority Key Identifier'],
            fingerprints: {
              'SHA-1': 'aa:bb:cc:dd:ee:ff:11:22:33:44:55:66:77:88:99:00',
              'SHA-256': '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00'
            }
          }
        };
      } else if (pemInput.includes('BEGIN CERTIFICATE REQUEST')) {
        detectedType = 'Certificate Signing Request';
        mockData = {
          type: detectedType,
          isValid: true,
          details: {
            subject: 'CN=example.com, O=Example Corp, L=San Francisco, ST=CA, C=US',
            publicKeyAlgorithm: 'RSA',
            keySize: '2048 bits',
            signatureAlgorithm: 'SHA256withRSA',
            extensions: ['Subject Alternative Name', 'Key Usage'],
            attributes: {
              challengePassword: 'Not present',
              unstructuredName: 'Not present'
            }
          }
        };
      } else if (pemInput.includes('BEGIN PKCS7')) {
        detectedType = 'PKCS#7 Container';
        mockData = {
          type: detectedType,
          isValid: true,
          details: {
            contentType: 'Signed Data',
            certificates: ['CN=example.com', 'CN=Intermediate CA', 'CN=Root CA'],
            signers: 1,
            digestAlgorithm: 'SHA-256',
            encryptionAlgorithm: 'RSA'
          }
        };
      } else if (pemInput.includes('BEGIN PRIVATE KEY') || pemInput.includes('BEGIN RSA PRIVATE KEY') || pemInput.includes('BEGIN EC PRIVATE KEY')) {
        detectedType = 'Private Key';
        mockData = {
          type: detectedType,
          isValid: true,
          warning: 'Private key detected - handle with extreme care!',
          details: {
            keyType: pemInput.includes('EC PRIVATE KEY') ? 'Elliptic Curve' : 'RSA',
            keySize: pemInput.includes('EC PRIVATE KEY') ? '256 bits (P-256)' : '2048 bits',
            encrypted: pemInput.includes('Proc-Type: 4,ENCRYPTED') ? 'Yes' : 'No',
            format: pemInput.includes('BEGIN RSA PRIVATE KEY') ? 'PKCS#1' : 'PKCS#8'
          }
        };
      } else if (pemInput.includes('BEGIN PUBLIC KEY')) {
        detectedType = 'Public Key';
        mockData = {
          type: detectedType,
          isValid: true,
          details: {
            keyType: 'RSA',
            keySize: '2048 bits',
            format: 'SPKI (Subject Public Key Info)',
            algorithm: 'rsaEncryption'
          }
        };
      } else {
        detectedType = 'Unknown';
        mockData = {
          type: detectedType,
          isValid: false,
          details: {
            error: 'Unable to detect PEM type or invalid PEM format',
            suggestion: 'Ensure the PEM data has proper BEGIN/END markers'
          }
        };
      }

      setParsedData(mockData);
      setIsParsing(false);
      
      toast({
        title: mockData.isValid ? "Success" : "Warning",
        description: mockData.isValid ? `Detected ${detectedType}` : "Unable to parse PEM data",
        variant: mockData.isValid ? "default" : "destructive"
      });
    }, 1500);
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('Certificate')) return Shield;
    if (type.includes('Request')) return FileText;
    if (type.includes('Private Key')) return Key;
    if (type.includes('Public Key')) return Key;
    if (type.includes('PKCS')) return Award;
    return Hash;
  };

  const renderDetails = (details: Record<string, any>) => {
    return Object.entries(details).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <div key={key} className="space-y-2">
            <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className="space-y-2">
            <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <div className="pl-4 space-y-2 border-l-2 border-border">
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey} className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {subKey.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {String(subValue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} className="space-y-2">
            <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <p className="text-sm font-mono text-muted-foreground break-all">
              {String(value)}
            </p>
          </div>
        );
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-card shadow-card border-border hover-scale transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle>PEM Parser</CardTitle>
          </div>
          <CardDescription>
            Parse and analyze PEM formatted data including X.509 certificates, CSRs, PKCS#7 containers, and keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">PEM Type Detection</label>
              <Select value={pemType} onValueChange={(value: PEMType) => setPemType(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="certificate">X.509 Certificate</SelectItem>
                  <SelectItem value="csr">Certificate Request</SelectItem>
                  <SelectItem value="pkcs7">PKCS#7 Container</SelectItem>
                  <SelectItem value="private-key">Private Key</SelectItem>
                  <SelectItem value="public-key">Public Key</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">PEM Data</label>
            <Textarea
              placeholder="-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTQwMzA1MTIzNDA5WhcNMTQwNDA0MTIzNDA5WjBF
...
-----END CERTIFICATE-----"
              className="font-mono min-h-[200px] bg-muted/50"
              value={pemInput}
              onChange={(e) => setPemInput(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={parsePEM} 
            disabled={isParsing}
            className="w-full transition-transform duration-200 hover:scale-105"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isParsing ? 'Parsing...' : 'Parse PEM Data'}
          </Button>
        </CardContent>
      </Card>

      {parsedData && (
        <Card className="bg-gradient-card shadow-card border-border animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                {(() => {
                  const IconComponent = getTypeIcon(parsedData.type);
                  return <IconComponent className="h-5 w-5 text-primary" />;
                })()}
                <span>Parse Results: {parsedData.type}</span>
              </CardTitle>
              <StatusBadge variant={parsedData.isValid ? "success" : "destructive"}>
                {parsedData.isValid ? "Valid" : "Invalid"}
              </StatusBadge>
            </div>
            {parsedData.warning && (
              <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <Shield className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning font-medium">{parsedData.warning}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDetails(parsedData.details)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};