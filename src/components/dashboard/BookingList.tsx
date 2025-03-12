
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking, User, mockBookings, mockUsers } from '@/types/database';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingListProps {
  title?: string;
  description?: string;
  limit?: number;
}

const BookingList: React.FC<BookingListProps> = ({ 
  title = "Prenotazioni recenti", 
  description = "Visualizza le ultime prenotazioni ricevute", 
  limit = 5 
}) => {
  // In a real app, this would fetch data from an API
  const bookings = [...mockBookings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, limit);

  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(user => user.id === userId);
  };

  const getStatusBadge = (status: Booking['status']) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Nessuna prenotazione trovata
            </div>
          ) : (
            bookings.map(booking => {
              const user = getUserById(booking.userId);
              return (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-white",
                      booking.status === 'pending' && "bg-yellow-500",
                      booking.status === 'confirmed' && "bg-blue-500",
                      booking.status === 'ready' && "bg-indigo-500",
                      booking.status === 'delivered' && "bg-green-500",
                      booking.status === 'cancelled' && "bg-red-500",
                    )}>
                      {user?.fullName.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-medium">{user?.fullName || 'Cliente sconosciuto'}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
          {bookings.length > 0 && (
            <Button variant="outline" className="w-full mt-4">
              Vedi tutte le prenotazioni
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingList;
