
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  User as UserIcon,
  Pill,
  FileText,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  mockBookings, 
  mockUsers, 
  mockMedications, 
  mockWhatsAppMessages,
  Booking,
  User,
  Medication,
  WhatsAppMessage,
  BookingStatus
} from '@/types/database';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import whatsappService from '@/services/whatsappService';
import n8nService from '@/services/n8nService';
import { useToast } from '@/hooks/use-toast';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundBooking = mockBookings.find(b => b.id === id);
    
    if (foundBooking) {
      setBooking(foundBooking);
      
      // Find related user
      const foundUser = mockUsers.find(u => u.id === foundBooking.userId);
      if (foundUser) setUser(foundUser);
      
      // Find related medications
      const bookedMeds = foundBooking.medications.map(m => 
        mockMedications.find(med => med.id === m.medicationId)
      ).filter((m): m is Medication => m !== undefined);
      setMedications(bookedMeds);
      
      // Find related messages
      const bookingMessages = mockWhatsAppMessages
        .filter(m => m.bookingId === foundBooking.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(bookingMessages);
    }
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    setLoading(true);
    
    try {
      // Send WhatsApp message
      const sentMessage = await whatsappService.sendMessage(
        user.phoneNumber,
        newMessage
      );
      
      if (sentMessage && booking) {
        // Add message to local state
        const updatedMessage = {
          ...sentMessage,
          bookingId: booking.id
        };
        
        setMessages(prev => [...prev, updatedMessage]);
        setNewMessage('');
        
        // Trigger n8n workflow
        await n8nService.triggerWorkflow('message_received', {
          message: updatedMessage,
          booking,
          user
        });
        
        toast({
          title: "Messaggio inviato",
          description: "Il messaggio è stato inviato con successo."
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio del messaggio.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (status: BookingStatus) => {
    if (!booking || !user) return;
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      const updatedBooking = { ...booking, status, updatedAt: new Date() };
      setBooking(updatedBooking);
      
      // Trigger n8n workflow
      await n8nService.triggerWorkflow('booking_updated', {
        booking: updatedBooking,
        user,
        previousStatus: booking.status
      });
      
      toast({
        title: "Stato aggiornato",
        description: `La prenotazione è stata aggiornata a "${getStatusLabel(status)}".`
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento dello stato.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case 'pending': return 'In attesa';
      case 'confirmed': return 'Confermata';
      case 'ready': return 'Pronta';
      case 'delivered': return 'Consegnata';
      case 'cancelled': return 'Annullata';
      default: return 'Sconosciuto';
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">In attesa</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Confermata</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">Pronta</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Consegnata</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Annullata</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };
  
  if (!booking || !user) {
    return (
      <div className="container py-10">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Torna indietro
        </Button>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Prenotazione non trovata</h2>
          <p className="mt-2 text-muted-foreground">
            La prenotazione richiesta non esiste o è stata rimossa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Torna al dashboard
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Prenotazione #{booking.id}</h1>
          <p className="text-muted-foreground">
            Creata il {format(new Date(booking.createdAt), 'dd MMMM yyyy', { locale: it })} alle {format(new Date(booking.createdAt), 'HH:mm')}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {booking.status !== 'cancelled' && booking.status !== 'delivered' && (
            <>
              {booking.status === 'pending' && (
                <Button 
                  variant="default" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => updateBookingStatus('confirmed')}
                  disabled={loading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Conferma
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <Button 
                  variant="default" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => updateBookingStatus('ready')}
                  disabled={loading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Segna come pronta
                </Button>
              )}
              {booking.status === 'ready' && (
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateBookingStatus('delivered')}
                  disabled={loading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Segna come consegnata
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => updateBookingStatus('cancelled')}
                disabled={loading}
              >
                <XCircle className="mr-2 h-4 w-4" /> Annulla
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Dettagli prenotazione</span>
                {getStatusBadge(booking.status)}
              </CardTitle>
              <CardDescription>
                Informazioni sulla prenotazione e i prodotti richiesti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Farmaci richiesti</h3>
                <div className="space-y-3">
                  {medications.map((med, idx) => (
                    <div key={med.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-pharma-light/20 text-pharma-dark flex items-center justify-center">
                          <Pill className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{med.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {med.dosage}{med.description ? ` - ${med.description}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={med.requiresPrescription ? "destructive" : "outline"}>
                          {med.requiresPrescription ? 'Ricetta richiesta' : 'Senza ricetta'}
                        </Badge>
                        <Badge variant={med.inStock ? "outline" : "secondary"} className={med.inStock ? "bg-green-50 text-green-800" : ""}>
                          {med.inStock ? 'Disponibile' : 'Non disponibile'}
                        </Badge>
                        <div className="font-semibold">
                          Qtà: {booking.medications.find(m => m.medicationId === med.id)?.quantity || 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {booking.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Note</h3>
                    <p className="text-sm bg-muted p-3 rounded-md">{booking.notes}</p>
                  </div>
                </>
              )}
              
              {booking.pickupTime && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Data e ora di ritiro</h3>
                    <div className="flex items-center bg-muted p-3 rounded-md">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>
                        {format(new Date(booking.pickupTime), 'dd MMMM yyyy', { locale: it })} alle {format(new Date(booking.pickupTime), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversazione WhatsApp</CardTitle>
              <CardDescription>
                Messaggi scambiati con il cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    Nessun messaggio scambiato
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
                        message.type === 'outgoing' ? 'bg-pharma text-white' : 'bg-gray-100'
                      }`}>
                        <div className="text-sm">{message.body}</div>
                        <div className={`text-xs mt-1 ${
                          message.type === 'outgoing' ? 'text-pharma-light' : 'text-muted-foreground'
                        }`}>
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Scrivi un messaggio..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="resize-none"
                  disabled={loading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || loading}
                  className="bg-pharma hover:bg-pharma-dark"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni cliente</CardTitle>
              <CardDescription>
                Dettagli di contatto del cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl bg-medical text-white">
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">Cliente dal {format(new Date(user.createdAt), 'MMMM yyyy', { locale: it })}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>{user.phoneNumber}</span>
                </div>
                
                {user.email && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{user.email}</span>
                  </div>
                )}
                
                {user.address && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <UserIcon className="mr-2 h-4 w-4" /> Visualizza profilo completo
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Azioni rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Stampa ricevuta
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" /> Invia promemoria
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Pill className="mr-2 h-4 w-4" /> Verifica disponibilità
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
