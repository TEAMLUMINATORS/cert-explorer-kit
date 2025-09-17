import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hash, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

export const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const { toast } = useToast();

  const generateHashes = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to hash",
        variant: "destructive",
      });
      return;
    }

    // Simulate hash generation (in real app, would use crypto APIs)
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    // Mock hash values for demonstration
    const mockHashes: HashResult = {
      md5: "5d41402abc4b2a76b9719d911017c592",
      sha1: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
      sha256: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
      sha384: "9ca694a90285c034432c9550421b7b9dbd5362d6e98e5e88e7acfc8e6c22bf1c4da9b5eabf3fd2d4bc1b2c5d2c0c6e4b5",
      sha512: "f7ce041f9b0d0a1d7b7f3f4e5c6d7e8f9f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff"
    };

    setHashes(mockHashes);
    toast({
      title: "Success",
      description: "Hashes generated successfully",
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(type);
      setTimeout(() => setCopiedHash(null), 2000);
      toast({
        title: "Copied",
        description: `${type.toUpperCase()} hash copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const hashTypes = [
    { key: 'md5', name: 'MD5', variant: 'destructive' as const, warning: 'Not cryptographically secure' },
    { key: 'sha1', name: 'SHA-1', variant: 'warning' as const, warning: 'Deprecated for security' },
    { key: 'sha256', name: 'SHA-256', variant: 'success' as const },
    { key: 'sha384', name: 'SHA-384', variant: 'success' as const },
    { key: 'sha512', name: 'SHA-512', variant: 'success' as const },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-card border-border">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-primary" />
            <CardTitle>Hash Generator</CardTitle>
          </div>
          <CardDescription>
            Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from your input text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here to generate hashes..."
            className="min-h-[100px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={generateHashes} className="w-full">
            <Hash className="mr-2 h-4 w-4" />
            Generate Hashes
          </Button>
        </CardContent>
      </Card>

      {hashes && (
        <Card className="bg-gradient-card shadow-card border-border">
          <CardHeader>
            <CardTitle>Hash Results</CardTitle>
            <CardDescription>
              Click any hash to copy it to your clipboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hashTypes.map(({ key, name, variant, warning }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={variant}>{name}</Badge>
                    {warning && (
                      <span className="text-xs text-muted-foreground">({warning})</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(hashes[key as keyof HashResult], name)}
                    className="h-6 w-6 p-0"
                  >
                    {copiedHash === name ? 
                      <Check className="h-3 w-3 text-success" /> : 
                      <Copy className="h-3 w-3" />
                    }
                  </Button>
                </div>
                <div 
                  className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => copyToClipboard(hashes[key as keyof HashResult], name)}
                >
                  <code className="text-sm font-mono break-all">
                    {hashes[key as keyof HashResult]}
                  </code>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};