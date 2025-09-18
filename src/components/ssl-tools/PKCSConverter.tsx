import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { RefreshCw, Download, Upload, FileText, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConversionType = 'pkcs7-to-pem' | 'pem-to-pkcs7' | 'pkcs12-to-pem' | 'pem-to-pkcs12';

export const PKCSConverter = () => {
  const [conversionType, setConversionType] = useState<ConversionType>('pkcs7-to-pem');
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [password, setPassword] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const convertData = async () => {
    if (!inputData.trim()) {
      toast({
        title: "Error",
        description: "Please provide input data to convert",
        variant: "destructive",
      });
      return;
    }

    if ((conversionType.includes('pkcs12')) && !password.trim()) {
      toast({
        title: "Error", 
        description: "PKCS#12 conversion requires a password",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);

    // Simulate conversion process
    setTimeout(() => {
      let result = '';
      
      switch (conversionType) {
        case 'pkcs7-to-pem':
          result = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTQwMzA1MTIzNDA5WhcNMTQwNDA0MTIzNDA5WjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btPjQ1xkNw2
-----END CERTIFICATE-----`;
          break;
        case 'pem-to-pkcs7':
          result = `MIIC2jCCAkMCAg38MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJKUDEOMAwG
A1UECBMFVG9reW8xEDAOBgNVBAcTB0NodW8ta3UxETAPBgNVBAoTCEZyYW5rNERE
MRgwFgYDVQQLEw9XZWJDZXJ0IFN1cHBvcnQxGDAWBgNVBAMTD0ZyYW5rNEREIFdl
YkNBMB4XDTEyMDgyMjA1MjU1NFoXDTE3MDgyMTA1MjU1NFowSzELMAkGA1UEBhMC
SkoxDjAMBgNVBAgTBVRva3lvMRAwDgYDVQQHEwdDaHVvLWt1MQwwCgYDVQQKEwNG
cmFuazEPMA0GA1UEAxMGV2ViQ0E=`;
          break;
        case 'pkcs12-to-pem':
          result = `Bag Attributes
    friendlyName: My Certificate
    localKeyID: 54 69 6D 65 20 31 33 32 34 38 35 39 30 31 35 36 37 37
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
-----END CERTIFICATE-----
Bag Attributes
    friendlyName: My Certificate
    localKeyID: 54 69 6D 65 20 31 33 32 34 38 35 39 30 31 35 36 37 37
Key Attributes: <No Attributes>
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDh/nCDmXaEqxN4
16b9XjV8acmbqA52uPzKbesWQSNZPZu0+NDXGg==
-----END PRIVATE KEY-----`;
          break;
        case 'pem-to-pkcs12':
          result = `PKCS#12 file created successfully.
Binary data cannot be displayed in text format.
Use the download button to save the .p12 file.`;
          break;
      }

      setOutputData(result);
      setIsConverting(false);
      toast({
        title: "Success",
        description: "Conversion completed successfully",
      });
    }, 1500);
  };

  const downloadResult = () => {
    const blob = new Blob([outputData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = conversionType.includes('pkcs12') ? 'converted.p12' : 'converted.pem';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "File downloaded successfully",
    });
  };

  const conversionOptions = [
    { value: 'pkcs7-to-pem', label: 'PKCS#7 to PEM' },
    { value: 'pem-to-pkcs7', label: 'PEM to PKCS#7' },
    { value: 'pkcs12-to-pem', label: 'PKCS#12 to PEM' },
    { value: 'pem-to-pkcs12', label: 'PEM to PKCS#12' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-card shadow-card border-border hover-scale transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <CardTitle>PKCS Converter</CardTitle>
          </div>
          <CardDescription>
            Convert between PKCS#7, PKCS#12, and PEM formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conversion Type</Label>
              <Select value={conversionType} onValueChange={(value: ConversionType) => setConversionType(value)}>
                <SelectTrigger className="animate-fade-in">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conversionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {conversionType.includes('pkcs12') && (
              <div className="space-y-2 animate-scale-in">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter PKCS#12 password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Input Data</Label>
            <Textarea
              placeholder={`Paste your ${conversionType.split('-')[0].toUpperCase()} data here...`}
              className="font-mono min-h-[200px] bg-muted/50"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
          </div>

          <Button 
            onClick={convertData} 
            disabled={isConverting}
            className="w-full transition-transform duration-200 hover:scale-105"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isConverting ? 'animate-spin' : ''}`} />
            {isConverting ? 'Converting...' : 'Convert'}
          </Button>
        </CardContent>
      </Card>

      {outputData && (
        <Card className="bg-gradient-card shadow-card border-border animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Conversion Result</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <StatusBadge variant="success">Success</StatusBadge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadResult}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              className="font-mono min-h-[300px] bg-muted/50"
              value={outputData}
              readOnly
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};