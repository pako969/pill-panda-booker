
import { WhatsAppMessage, Booking, BookingStatus, User } from "../types/database";
import whatsappService from "./whatsappService";

// This service would integrate with n8n workflows in production
// For now, it provides a simulation interface for demo purposes

export class N8nService {
  private static instance: N8nService;
  private webhookUrl: string | null = null;
  
  private constructor() {}

  public static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }

  public configureWebhook(url: string): void {
    this.webhookUrl = url;
    console.log(`n8n webhook configured: ${url}`);
  }

  public async triggerWorkflow(
    eventType: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'message_received',
    payload: any
  ): Promise<boolean> {
    if (!this.webhookUrl) {
      console.warn('n8n webhook not configured. Cannot trigger workflow.');
      return false;
    }

    console.log(`Triggering n8n workflow for event ${eventType}:`, payload);
    
    try {
      // In production, this would make an actual HTTP request to the n8n webhook
      // For demo purposes, we'll simulate the response
      
      // Simulate a delayed notification for booking status changes
      if (eventType === 'booking_updated' && payload.booking) {
        const booking = payload.booking as Booking;
        const user = payload.user as User;
        
        // Simulate an asynchronous task
        setTimeout(() => {
          console.log(`Sending WhatsApp notification about booking status: ${booking.status}`);
          const statusMessage = whatsappService.getStatusUpdateMessage(booking.status);
          whatsappService.sendMessage(user.phoneNumber, statusMessage);
        }, 2000);
      }
      
      return true;
    } catch (error) {
      console.error('Error triggering n8n workflow:', error);
      return false;
    }
  }

  public async handleWebhookEvent(body: any): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    console.log('Received n8n webhook event:', body);
    
    try {
      // Process webhook data based on the event type
      const eventType = body.eventType;
      
      switch (eventType) {
        case 'message_processed':
          // n8n has processed a message and returned an action to take
          return {
            success: true,
            message: 'Message processing event received',
            data: body.data
          };
          
        case 'booking_confirmation':
          // n8n has confirmed a booking and provided details
          return {
            success: true,
            message: 'Booking confirmation event received',
            data: body.data
          };
          
        case 'reminder_scheduled':
          // n8n has scheduled a reminder
          return {
            success: true,
            message: 'Reminder scheduling event received',
            data: body.data
          };
          
        default:
          return {
            success: false,
            message: `Unknown event type: ${eventType}`
          };
      }
    } catch (error) {
      console.error('Error handling n8n webhook event:', error);
      return {
        success: false,
        message: 'Error processing webhook event'
      };
    }
  }
}

export default N8nService.getInstance();
