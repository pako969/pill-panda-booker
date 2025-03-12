
import { WhatsAppMessage, BookingStatus } from "../types/database";

// This service would integrate with WhatsApp Business API in production
// For now, it provides a simulation interface for demo purposes

export class WhatsAppService {
  private static instance: WhatsAppService;
  private webhook: string | null = null;
  
  private constructor() {}

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public configureWebhook(url: string): void {
    this.webhook = url;
    console.log(`WhatsApp webhook configured: ${url}`);
  }

  public async sendMessage(to: string, message: string): Promise<WhatsAppMessage | null> {
    console.log(`Sending WhatsApp message to ${to}: ${message}`);
    
    try {
      // In production, this would call the WhatsApp Business API
      const messageId = `msg_${Date.now()}`;
      
      // Simulate API response
      const sentMessage: WhatsAppMessage = {
        id: messageId,
        from: '+39000000000', // Pharmacy number
        to,
        body: message,
        timestamp: new Date(),
        type: 'outgoing',
        processed: true
      };
      
      // In production, this would notify the webhook about the message
      if (this.webhook) {
        console.log(`Notifying webhook about sent message: ${messageId}`);
        // Actually call the webhook in production
      }
      
      return sentMessage;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return null;
    }
  }

  public async processIncomingMessage(from: string, body: string): Promise<{
    processed: boolean,
    response?: string,
    action?: string
  }> {
    console.log(`Processing incoming WhatsApp message from ${from}: ${body}`);
    
    // Basic message parsing logic - in production this would be more sophisticated,
    // possibly using NLP to understand intent
    const lowercaseBody = body.toLowerCase();
    
    if (lowercaseBody.includes('prenota') || lowercaseBody.includes('ordina') || lowercaseBody.includes('prenotare')) {
      // Basic intent detection for booking request
      return {
        processed: true,
        response: "Grazie per la sua richiesta di prenotazione. Può specificare quali medicinali desidera prenotare?",
        action: 'request_details'
      };
    } 
    else if (lowercaseBody.includes('paracetamolo') || lowercaseBody.includes('antibiotico') || 
             lowercaseBody.includes('amoxicillina') || lowercaseBody.includes('ibuprofene')) {
      // Detected medication names
      return {
        processed: true,
        response: "Abbiamo ricevuto la sua richiesta. La contatteremo a breve per confermare la disponibilità e la prenotazione.",
        action: 'create_booking'
      };
    }
    else if (lowercaseBody.includes('annulla') || lowercaseBody.includes('cancella')) {
      // Cancel request
      return {
        processed: true,
        response: "La sua richiesta di cancellazione è stata ricevuta. La prenotazione sarà annullata.",
        action: 'cancel_booking'
      };
    }
    else if (lowercaseBody.includes('stato') || lowercaseBody.includes('aggiornamento')) {
      // Status update request
      return {
        processed: true,
        response: "Stiamo verificando lo stato della sua prenotazione e la aggiorneremo a breve.",
        action: 'status_check'
      };
    }
    
    // Default fallback for unrecognized messages
    return {
      processed: false,
      response: "Non ho compreso la sua richiesta. Può riprovare specificando se desidera prenotare un medicinale, verificare lo stato di una prenotazione, o annullare una prenotazione?",
    };
  }

  public getStatusUpdateMessage(status: BookingStatus): string {
    switch (status) {
      case 'pending':
        return "La sua prenotazione è in fase di elaborazione. La contatteremo a breve.";
      case 'confirmed':
        return "La sua prenotazione è stata confermata. Può ritirare i farmaci presso la nostra farmacia.";
      case 'ready':
        return "I suoi medicinali sono pronti per il ritiro presso la nostra farmacia.";
      case 'delivered':
        return "La sua prenotazione è stata consegnata. Grazie per aver utilizzato il nostro servizio.";
      case 'cancelled':
        return "La sua prenotazione è stata annullata come richiesto.";
      default:
        return "Lo stato della sua prenotazione è stato aggiornato.";
    }
  }
}

export default WhatsAppService.getInstance();
