import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const encodeBase64 = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encode",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast({
        title: "Success",
        description: "Text encoded to Base64",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode text",
        variant: "destructive",
      });
    }
  };

  const decodeBase64 = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter Base64 text to decode",
        variant: "destructive",
      });
      return;
    }

    try {
      const decoded = atob(input);
      setOutput(decoded);
      toast({
        title: "Success",
        description: "Base64 decoded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid Base64 input",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Output copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Code2 className="h-5 w-5 text-primary" />
          <CardTitle>Base64 Encoder/Decoder</CardTitle>
        </div>
        <CardDescription>
          Encode text to Base64 or decode Base64 back to plain text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="encode" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encode" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Plain Text Input</label>
              <Textarea
                placeholder="Enter text to encode to Base64..."
                className="min-h-[100px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button onClick={encodeBase64} className="w-full">
              <Code2 className="mr-2 h-4 w-4" />
              Encode to Base64
            </Button>
          </TabsContent>
          
          <TabsContent value="decode" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base64 Input</label>
              <Textarea
                placeholder="Enter Base64 text to decode..."
                className="min-h-[100px] font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button onClick={decodeBase64} className="w-full">
              <Code2 className="mr-2 h-4 w-4" />
              Decode from Base64
            </Button>
          </TabsContent>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Output</label>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? 
                      <Check className="h-4 w-4 text-success" /> : 
                      <Copy className="h-4 w-4" />
                    }
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                  >
                    Clear
                  </Button>
                </div>
              </div>
              <Textarea
                className="min-h-[100px] font-mono bg-muted/50"
                value={output}
                readOnly
              />
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};