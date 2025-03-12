
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Reply, MoreHorizontal } from 'lucide-react';
import { WhatsAppMessage, mockWhatsAppMessages, mockUsers } from '@/types/database';

interface RecentMessagesProps {
  limit?: number;
}

const RecentMessages: React.FC<RecentMessagesProps> = ({ limit = 5 }) => {
  // In a real app, this would fetch data from an API
  const messages = [...mockWhatsAppMessages]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  const getUserNameByPhone = (phoneNumber: string): string => {
    const user = mockUsers.find(user => user.phoneNumber === phoneNumber);
    return user?.fullName || 'Cliente';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Messaggi WhatsApp</CardTitle>
            <CardDescription>Conversazioni recenti con i clienti</CardDescription>
          </div>
          <Badge className="bg-green-500">
            WhatsApp connesso
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Nessun messaggio trovato
            </div>
          ) : (
            messages.filter(msg => msg.type === 'incoming').map(message => (
              <div key={message.id} className="flex gap-4 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <Avatar>
                  <AvatarFallback className="bg-medical text-white">
                    {getUserNameByPhone(message.from).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {getUserNameByPhone(message.from)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{message.body}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-muted-foreground">
                      {message.bookingId && 
                        <span>Prenotazione #{message.bookingId}</span>
                      }
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Reply className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {messages.length > 0 && (
            <Button variant="outline" className="w-full mt-4">
              Vedi tutti i messaggi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMessages;
