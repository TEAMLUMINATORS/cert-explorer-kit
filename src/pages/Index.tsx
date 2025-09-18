import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, Hash, Code2, FileText, Globe, RefreshCw, Award, Key } from "lucide-react";
import { CertificateAnalyzer } from "@/components/ssl-tools/CertificateAnalyzer";
import { TLSChecker } from "@/components/ssl-tools/TLSChecker";
import { HashGenerator } from "@/components/ssl-tools/HashGenerator";
import { Base64Tool } from "@/components/ssl-tools/Base64Tool";
import { CertificateTransparency } from "@/components/ssl-tools/CertificateTransparency";
import { PKCSConverter } from "@/components/ssl-tools/PKCSConverter";
import { CertificateGenerator } from "@/components/ssl-tools/CertificateGenerator";
import { CSRManager } from "@/components/ssl-tools/CSRManager";
import { PEMParser } from "@/components/ssl-tools/PEMParser";

const Index = () => {
  const tools = [
    {
      id: 'certificate',
      name: 'Certificate Analyzer',
      description: 'Analyze X.509 certificates and view their details',
      icon: FileText,
      component: CertificateAnalyzer
    },
    {
      id: 'tls',
      name: 'TLS Checker',
      description: 'Test SSL/TLS configurations and supported protocols',
      icon: Globe,
      component: TLSChecker
    },
    {
      id: 'ct-logs',
      name: 'Certificate Transparency',
      description: 'Search Certificate Transparency logs in real-time',
      icon: Shield,
      component: CertificateTransparency
    },
    {
      id: 'pkcs-converter',
      name: 'PKCS Converter',
      description: 'Convert between PKCS#7, PKCS#12, and PEM formats',
      icon: RefreshCw,
      component: PKCSConverter
    },
    {
      id: 'cert-generator',
      name: 'Certificate Generator',
      description: 'Generate self-signed certificates with custom parameters',
      icon: Award,
      component: CertificateGenerator
    },
    {
      id: 'csr-manager',
      name: 'CSR Manager',
      description: 'Generate and manage RSA/ECC Certificate Signing Requests',
      icon: Key,
      component: CSRManager
    },
    {
      id: 'pem-parser',
      name: 'PEM Parser',
      description: 'Parse X.509, PKCS#7, and CSR data in PEM format',
      icon: Award,
      component: PEMParser
    },
    {
      id: 'hash',
      name: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes',
      icon: Hash,
      component: HashGenerator
    },
    {
      id: 'base64',
      name: 'Base64 Tool',
      description: 'Encode and decode Base64 text',
      icon: Code2,
      component: Base64Tool
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">OpenSSL Toolkit</h1>
              <p className="text-muted-foreground">
                Professional SSL/TLS certificate and cryptographic tools
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="certificate" className="space-y-6">
          {/* Tools Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <TabsList key={tool.id} className="h-auto p-0">
                  <TabsTrigger
                    value={tool.id}
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{tool.name}</div>
                      <div className="text-xs opacity-80 hidden md:block">
                        {tool.description}
                      </div>
                    </div>
                  </TabsTrigger>
                </TabsList>
              );
            })}
          </div>

          {/* Tool Content */}
          {tools.map((tool) => {
            const ToolComponent = tool.component;
            return (
              <TabsContent key={tool.id} value={tool.id}>
                <ToolComponent />
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Use Our SSL Toolkit?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card border-border">
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Security First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All operations are performed client-side. Your certificates and data never leave your browser.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Professional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Industry-standard cryptographic tools with accurate analysis and detailed reporting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border">
              <CardHeader>
                <Globe className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Real-time Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Test live domains and certificates with comprehensive TLS/SSL configuration analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p>© 2024 OpenSSL Toolkit. Built with security and privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;