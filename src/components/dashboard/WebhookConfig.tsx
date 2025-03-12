
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import whatsappService from '@/services/whatsappService';
import n8nService from '@/services/n8nService';

const WebhookConfig: React.FC = () => {
  const { toast } = useToast();
  const [whatsappWebhook, setWhatsappWebhook] = useState('');
  const [n8nWebhook, setN8nWebhook] = useState('');
  const [whatsappConfigured, setWhatsappConfigured] = useState(false);
  const [n8nConfigured, setN8nConfigured] = useState(false);

  const handleWhatsappConfig = () => {
    if (!whatsappWebhook) {
      toast({
        title: "Errore",
        description: "Inserisci un URL webhook valido",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate URL format
      new URL(whatsappWebhook);
      
      // Configure the service
      whatsappService.configureWebhook(whatsappWebhook);
      setWhatsappConfigured(true);
      
      toast({
        title: "Webhook WhatsApp configurato",
        description: "L'integrazione WhatsApp è stata configurata correttamente",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "L'URL del webhook non è valido",
        variant: "destructive",
      });
    }
  };

  const handleN8nConfig = () => {
    if (!n8nWebhook) {
      toast({
        title: "Errore",
        description: "Inserisci un URL webhook valido",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate URL format
      new URL(n8nWebhook);
      
      // Configure the service
      n8nService.configureWebhook(n8nWebhook);
      setN8nConfigured(true);
      
      toast({
        title: "Webhook n8n configurato",
        description: "L'integrazione n8n è stata configurata correttamente",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "L'URL del webhook non è valido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configurazione WhatsApp Business API</CardTitle>
              <CardDescription>Configura il webhook per l'integrazione con WhatsApp</CardDescription>
            </div>
            {whatsappConfigured && (
              <Badge className="bg-green-500">
                Configurato
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Webhook WhatsApp</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://api.example.com/whatsapp-webhook"
                  value={whatsappWebhook}
                  onChange={(e) => setWhatsappWebhook(e.target.value)}
                />
                <Button onClick={handleWhatsappConfig}>
                  {whatsappConfigured ? "Aggiorna" : "Configura"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Istruzioni:</p>
              <ol className="list-decimal pl-4 space-y-1 mt-1">
                <li>Crea un account WhatsApp Business API</li>
                <li>Configura un numero di telefono</li>
                <li>Crea un webhook endpoint e inserisci l'URL qui sopra</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configurazione n8n</CardTitle>
              <CardDescription>Configura il webhook per l'integrazione con i workflow n8n</CardDescription>
            </div>
            {n8nConfigured && (
              <Badge className="bg-green-500">
                Configurato
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Webhook n8n</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://n8n.example.com/webhook/pill-panda"
                  value={n8nWebhook}
                  onChange={(e) => setN8nWebhook(e.target.value)}
                />
                <Button onClick={handleN8nConfig}>
                  {n8nConfigured ? "Aggiorna" : "Configura"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Istruzioni:</p>
              <ol className="list-decimal pl-4 space-y-1 mt-1">
                <li>Configura un'istanza n8n</li>
                <li>Crea un workflow con un trigger webhook</li>
                <li>Copia l'URL del webhook e inseriscilo qui sopra</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookConfig;
