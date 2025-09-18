import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileText, Key, Download, Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CSRConfig {
  commonName: string;
  organization: string;
  organizationUnit: string;
  locality: string;
  state: string;
  country: string;
  keyType: 'rsa' | 'ecc';
  keySize: string;
  subjectAltNames: string;
}

interface CSRInfo {
  subject: string;
  publicKeyInfo: string;
  signatureAlgorithm: string;
  extensions: string[];
  isValid: boolean;
}

export const CSRManager = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [config, setConfig] = useState<CSRConfig>({
    commonName: '',
    organization: '',
    organizationUnit: '',
    locality: '',
    state: '',
    country: '',
    keyType: 'rsa',
    keySize: '2048',
    subjectAltNames: ''
  });
  const [generatedCSR, setGeneratedCSR] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [csrInput, setCsrInput] = useState('');
  const [csrInfo, setCsrInfo] = useState<CSRInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const updateConfig = (field: keyof CSRConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const generateCSR = async () => {
    if (!config.commonName.trim()) {
      toast({
        title: "Error",
        description: "Common Name (CN) is required",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate CSR generation
    setTimeout(() => {
      const mockCSR = `-----BEGIN CERTIFICATE REQUEST-----
MIICijCCAXICAQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUx
ITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBANH+cIOZdoSrE3jXpv1eNXxpyZuoDna4/Mpt6xZB
I1k9m7T40NcZDcNgU4/T+5XRoytjp0fkHVdv/s+n6vu88Os9E/ENlqidhPCtCCfS
fY/kN8fkPBfhdBfCty+WfhfA+D+S9yPVND/EO8/RdUPkN2dk/BfkNiukNEfBexeQ
/D+fhfCtWPBfcCAwEAAaAAMA0GCSqGSIb3DQEBCwUAA4IBAQCy8jQHRjIRE8rO
eYMQ6wz0o5D+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y
+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+
8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8z
R5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ==
-----END CERTIFICATE REQUEST-----`;

      const mockPrivateKey = config.keyType === 'ecc' ? 
`-----BEGIN EC PRIVATE KEY-----
MHcCAQEEICdg2P7BQzQkQw8kfMnJ0OZv8QW+M5Y+Q8nR8jQ5tJ+PoAoGCCqGSM49
AwEHoUQDQgAE0f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btPjQ1xkN
w2BTj9P7ldGjK2OnR+QdV2/+z6fq+7zw6z0T8Q==
-----END EC PRIVATE KEY-----` :
`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btPjQ
1xkNw2BTj9P7ldGjK2OnR+QdV2/+z6fq+7zw6z0T8Q2WqJ2E8K0IJ9J9j+Q3x+Q8
F+F0F8K3L5Z+F8D4P5L3I9U0P8Q7z9F1Q+Q3Z2T8F+Q2K6Q0R8F7F5D8P5+F8K1Y
8F9wIDAQABAoIBABWdl2Q5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9
Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8n
R8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5m
Q+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ
+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQJBANQ8zR5gQ+sP5M+8Q5mQ+sM5Y
+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+
8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8CQQCyQ8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5t
J+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y
+Q8nR8jQ5tJ+P9Q8AkEAhQ8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5g
Q+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5t
J+P9Q8CQHyQ8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5m
Q+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8AkEA2
Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8n
R8jQ5tJ+P9Q8zR5gQ+sP5M+8Q5mQ+sM5Y+Q8nR8jQ5tJ+P9Q8
-----END RSA PRIVATE KEY-----`;

      setGeneratedCSR(mockCSR);
      setGeneratedKey(mockPrivateKey);
      setIsGenerating(false);
      
      toast({
        title: "Success",
        description: "CSR and private key generated successfully",
      });
    }, 2000);
  };

  const analyzeCSR = async () => {
    if (!csrInput.trim()) {
      toast({
        title: "Error",
        description: "Please paste a CSR to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate CSR analysis
    setTimeout(() => {
      const mockCSRInfo: CSRInfo = {
        subject: `CN=${config.commonName || 'example.com'}, O=Example Corp, L=San Francisco, ST=CA, C=US`,
        publicKeyInfo: `RSA (2048 bits)`,
        signatureAlgorithm: 'SHA256withRSA',
        extensions: ['Subject Alternative Name', 'Key Usage', 'Extended Key Usage'],
        isValid: true
      };

      setCsrInfo(mockCSRInfo);
      setIsAnalyzing(false);
      
      toast({
        title: "Success",
        description: "CSR analyzed successfully",
      });
    }, 1500);
  };

  const downloadFiles = (type: 'csr' | 'key' | 'both') => {
    if (type === 'csr' || type === 'both') {
      const blob = new Blob([generatedCSR], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.csr';
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
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>CSR Manager</CardTitle>
          </div>
          <CardDescription>
            Generate and analyze Certificate Signing Requests (CSR) for RSA and ECC keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="transition-all duration-200">Generate CSR</TabsTrigger>
              <TabsTrigger value="analyze" className="transition-all duration-200">Analyze CSR</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6 mt-6">
              {/* Subject Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-primary" />
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

              {/* Key Parameters */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Key Parameters</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onClick={generateCSR} 
                disabled={isGenerating}
                className="w-full transition-transform duration-200 hover:scale-105"
              >
                <FileText className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Generate CSR'}
              </Button>

              {generatedCSR && generatedKey && (
                <Card className="bg-gradient-card shadow-card border-border animate-scale-in mt-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Generated CSR & Private Key</CardTitle>
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
                        <Label>Certificate Signing Request (certificate.csr)</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFiles('csr')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <Textarea
                        className="font-mono min-h-[200px] bg-muted/50"
                        value={generatedCSR}
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
            </TabsContent>

            <TabsContent value="analyze" className="space-y-6 mt-6">
              <div className="space-y-4">
                <Label>Certificate Signing Request (PEM format)</Label>
                <Textarea
                  placeholder="-----BEGIN CERTIFICATE REQUEST-----
MIICijCCAXICAQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUx
ITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDCCASIwDQYJKoZIhvcN
...
-----END CERTIFICATE REQUEST-----"
                  className="font-mono min-h-[200px] bg-muted/50"
                  value={csrInput}
                  onChange={(e) => setCsrInput(e.target.value)}
                />
                <Button 
                  onClick={analyzeCSR} 
                  disabled={isAnalyzing}
                  className="w-full transition-transform duration-200 hover:scale-105"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze CSR'}
                </Button>
              </div>

              {csrInfo && (
                <Card className="bg-gradient-card shadow-card border-border animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>CSR Analysis Results</CardTitle>
                      <StatusBadge variant={csrInfo.isValid ? "success" : "destructive"}>
                        <Check className="h-3 w-3 mr-1" />
                        {csrInfo.isValid ? "Valid" : "Invalid"}
                      </StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Subject</span>
                        <p className="text-sm font-mono text-muted-foreground break-all bg-muted/50 p-2 rounded">
                          {csrInfo.subject}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Public Key Info</span>
                        <p className="text-sm font-mono text-muted-foreground">
                          {csrInfo.publicKeyInfo}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium">Signature Algorithm</span>
                        <p className="text-sm font-mono text-muted-foreground">
                          {csrInfo.signatureAlgorithm}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium">Extensions</span>
                        <div className="space-y-1">
                          {csrInfo.extensions.map((ext, index) => (
                            <StatusBadge key={index} variant="secondary" className="mr-1 mb-1">
                              {ext}
                            </StatusBadge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};