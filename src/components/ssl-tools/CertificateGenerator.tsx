import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { Award, Settings, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateConfig {
  commonName: string;
  organization: string;
  organizationUnit: string;
  locality: string;
  state: string;
  country: string;
  keyType: 'rsa' | 'ecc';
  keySize: string;
  validDays: string;
  subjectAltNames: string;
}

export const CertificateGenerator = () => {
  const [config, setConfig] = useState<CertificateConfig>({
    commonName: '',
    organization: '',
    organizationUnit: '',
    locality: '',
    state: '',
    country: '',
    keyType: 'rsa',
    keySize: '2048',
    validDays: '365',
    subjectAltNames: ''
  });
  const [generatedCert, setGeneratedCert] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const updateConfig = (field: keyof CertificateConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const generateCertificate = async () => {
    if (!config.commonName.trim()) {
      toast({
        title: "Error",
        description: "Common Name (CN) is required",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate certificate generation
    setTimeout(() => {
      const subject = `CN=${config.commonName}${config.organization ? `, O=${config.organization}` : ''}${config.organizationUnit ? `, OU=${config.organizationUnit}` : ''}${config.locality ? `, L=${config.locality}` : ''}${config.state ? `, ST=${config.state}` : ''}${config.country ? `, C=${config.country}` : ''}`;
      
      const mockCertificate = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjQwMTE1MTIzNDA5WhcNMjUwMTE1MTIzNDA5WjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btPjQ1xkNw2
BTj9P7ldGjK2OnR+QdV2/+z6fq+7zw6z0T8Q2WqJ2E8K0IJ9J9j+Q3x+Q8F+F0
F8K3L5Z+F8D4P5L3I9U0P8Q7z9F1Q+Q3Z2T8F+Q2K6Q0R8F7F5D8P5+F8K1Y8F
9wIDAQABo1MwUTAdBgNVHQ4EFgQU4f5wg5l2hKsTeNem/V41fGnJm6gwHwYDVR0j
BBgwFoAU4f5wg5l2hKsTeNem/V41fGnJm6gwDwYDVR0TAQH/BAUwAwEB/zANBgkq
hkiG9w0BAQsFAAOCAQEA2E2E+Q7z0Q5+Q8F8K0L5F8D2P+Q7F5R8F1Q3X8F+Q8Y0
-----END CERTIFICATE-----`;

      const mockPrivateKey = config.keyType === 'ecc' ? 
`-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIFSWWZmVZ+vJgvOKqlZUrGfMZwZmYFqZGQJ+jwvpM2EjoAoGCCqGSM49
AwEHoUQDQgAE4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btPjQ1xkN
w2BTj9P7ldGjK2OnR+QdV2/+z6fq+7zw6z0T8Q==
-----END EC PRIVATE KEY-----` :
`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btPjQ
1xkNw2BTj9P7ldGjK2OnR+QdV2/+z6fq+7zw6z0T8Q2WqJ2E8K0IJ9J9j+Q3x+Q8
F+F0F8K3L5Z+F8D4P5L3I9U0P8Q7z9F1Q+Q3Z2T8F+Q2K6Q0R8F7F5D8P5+F8K1Y
8F9wIDAQABAoIBAHZ7E+Q8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8
F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0
L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8
F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQJ+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F
1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQJBANEx
Q8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y
8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wCQQDTNQ8F+K0L5R8F1D2P+Q7F5
D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+
Q7F5D8P5+F8K1Y8F9wAkEAwKQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0
L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQJ
ANVQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8
K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wAkBNYQ8F+K0L5R8F1D2P+Q7
F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2P+Q7F5D8P5+F8K1Y8F9wQ8F+K0L5R8F1D2
P+Q7F5D8P5+F8K1Y8F9w
-----END RSA PRIVATE KEY-----`;

      setGeneratedCert(mockCertificate);
      setGeneratedKey(mockPrivateKey);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "Self-signed certificate generated successfully",
      });
    }, 2000);
  };

  const downloadFiles = (type: 'cert' | 'key' | 'both') => {
    if (type === 'cert' || type === 'both') {
      const blob = new Blob([generatedCert], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.crt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    if (type === 'key' || type === 'both') {
      const blob = new Blob([generatedKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'private.key';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Downloaded",
      description: "Files downloaded successfully",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-card shadow-card border-border hover-scale transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle>Certificate Generator</CardTitle>
          </div>
          <CardDescription>
            Generate self-signed X.509 certificates with custom parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subject Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-primary" />
              <Label className="text-base font-semibold">Subject Information</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Common Name (CN) *</Label>
                <Input
                  placeholder="example.com"
                  value={config.commonName}
                  onChange={(e) => updateConfig('commonName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Organization (O)</Label>
                <Input
                  placeholder="Example Corp"
                  value={config.organization}
                  onChange={(e) => updateConfig('organization', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Organizational Unit (OU)</Label>
                <Input
                  placeholder="IT Department"
                  value={config.organizationUnit}
                  onChange={(e) => updateConfig('organizationUnit', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Locality (L)</Label>
                <Input
                  placeholder="San Francisco"
                  value={config.locality}
                  onChange={(e) => updateConfig('locality', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>State (ST)</Label>
                <Input
                  placeholder="California"
                  value={config.state}
                  onChange={(e) => updateConfig('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Country (C)</Label>
                <Input
                  placeholder="US"
                  maxLength={2}
                  value={config.country}
                  onChange={(e) => updateConfig('country', e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>

          {/* Technical Parameters */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Technical Parameters</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Key Type</Label>
                <Select value={config.keyType} onValueChange={(value: 'rsa' | 'ecc') => updateConfig('keyType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rsa">RSA</SelectItem>
                    <SelectItem value="ecc">ECC (Elliptic Curve)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Key Size</Label>
                <Select value={config.keySize} onValueChange={(value) => updateConfig('keySize', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.keyType === 'rsa' ? (
                      <>
                        <SelectItem value="2048">2048 bits</SelectItem>
                        <SelectItem value="3072">3072 bits</SelectItem>
                        <SelectItem value="4096">4096 bits</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="256">256 bits (P-256)</SelectItem>
                        <SelectItem value="384">384 bits (P-384)</SelectItem>
                        <SelectItem value="521">521 bits (P-521)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valid Days</Label>
                <Input
                  type="number"
                  placeholder="365"
                  value={config.validDays}
                  onChange={(e) => updateConfig('validDays', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Subject Alternative Names */}
          <div className="space-y-2">
            <Label>Subject Alternative Names (Optional)</Label>
            <Input
              placeholder="DNS:example.com,DNS:*.example.com,IP:192.168.1.1"
              value={config.subjectAltNames}
              onChange={(e) => updateConfig('subjectAltNames', e.target.value)}
            />
          </div>

          <Button 
            onClick={generateCertificate} 
            disabled={isGenerating}
            className="w-full transition-transform duration-200 hover:scale-105"
          >
            <Award className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Certificate'}
          </Button>
        </CardContent>
      </Card>

      {generatedCert && generatedKey && (
        <Card className="bg-gradient-card shadow-card border-border animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Certificate & Private Key</CardTitle>
              <div className="flex items-center space-x-2">
                <StatusBadge variant="success">Generated</StatusBadge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFiles('both')}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Both
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Certificate (certificate.crt)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFiles('cert')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <Textarea
                className="font-mono min-h-[200px] bg-muted/50"
                value={generatedCert}
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Private Key (private.key)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFiles('key')}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <Textarea
                className="font-mono min-h-[200px] bg-muted/50"
                value={generatedKey}
                readOnly
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};