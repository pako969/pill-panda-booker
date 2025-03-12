
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Booking, User, mockBookings, mockUsers, mockMedications } from '@/types/database';
import { Eye, ExternalLink, MessageCircle, Check, X, Pencil, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState([...mockBookings].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ));
  
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'status' | 'product' | null>(null);
  const [editValue, setEditValue] = useState('');

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

  const startEditing = (orderId: string, field: 'status' | 'product', currentValue: string) => {
    setEditingOrder(orderId);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditingField(null);
    setEditValue('');
  };

  const saveEditing = (orderId: string) => {
    if (!editingField) return;

    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          if (editingField === 'status') {
            const validStatus: Booking['status'][] = ['pending', 'confirmed', 'ready', 'delivered', 'cancelled'];
            // Check if the entered status is valid
            const status = validStatus.includes(editValue as Booking['status']) 
              ? editValue as Booking['status'] 
              : order.status;
            
            toast.success(`Stato dell'ordine #${orderId} aggiornato a ${status}`);
            return { ...order, status };
          } else if (editingField === 'product') {
            // For demo purposes, we'll update the first medication's name
            const firstMedId = order.medications[0]?.medicationId;
            if (firstMedId) {
              toast.success(`Prodotto dell'ordine #${orderId} aggiornato a ${editValue}`);
              // In a real app, this would update the medication in the database
              return order;
            }
          }
        }
        return order;
      })
    );

    cancelEditing();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista Ordini</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="px-4 py-2 font-medium">ID Ordine</th>
                <th className="px-4 py-2 font-medium">Chat ID</th>
                <th className="px-4 py-2 font-medium">Telefono Cliente</th>
                <th className="px-4 py-2 font-medium">Prodotto Richiesto</th>
                <th className="px-4 py-2 font-medium">Immagine</th>
                <th className="px-4 py-2 font-medium">Stato</th>
                <th className="px-4 py-2 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nessun ordine trovato
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const user = getUserById(order.userId);
                  
                  // Get first medication as the "requested product" for display
                  const requestedProduct = order.medications[0] ? 
                    mockMedications.find(med => med.id === order.medications[0].medicationId)?.name || 'Prodotto sconosciuto' : 
                    '';
                  
                  // For the demo, we'll simulate that some orders have image requests
                  const hasImageRequest = order.id.charCodeAt(0) % 2 === 0; // Just for demo purposes
                  const imageUrl = hasImageRequest ? `https://placehold.co/100x100?text=Med+${order.id}` : '';
                  
                  // For the demo, we'll use the booking ID as the chat ID
                  const chatId = `chat_${order.id}`;
                  
                  return (
                    <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">#{order.id}</td>
                      <td className="px-4 py-3">{chatId}</td>
                      <td className="px-4 py-3">
                        {user?.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {!hasImageRequest ? (
                          editingOrder === order.id && editingField === 'product' ? (
                            <div className="flex items-center gap-1">
                              <Input 
                                value={editValue} 
                                onChange={(e) => setEditValue(e.target.value)}
                                className="h-8 py-1 w-40" 
                                autoFocus
                              />
                              <Button variant="ghost" size="icon" onClick={() => saveEditing(order.id)} title="Salva">
                                <Save className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={cancelEditing} title="Annulla">
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span>{requestedProduct}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => startEditing(order.id, 'product', requestedProduct)}
                                title="Modifica prodotto"
                                className="h-6 w-6 ml-1"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        ) : ''}
                      </td>
                      <td className="px-4 py-3">
                        {hasImageRequest ? (
                          <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            <img src={imageUrl} alt="Prodotto" className="w-8 h-8 object-cover" />
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : ''}
                      </td>
                      <td className="px-4 py-3">
                        {editingOrder === order.id && editingField === 'status' ? (
                          <div className="flex items-center gap-1">
                            <Input 
                              value={editValue} 
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 py-1 w-40" 
                              placeholder="pending, confirmed, ready, delivered, cancelled"
                              autoFocus
                            />
                            <Button variant="ghost" size="icon" onClick={() => saveEditing(order.id)} title="Salva">
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={cancelEditing} title="Annulla">
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            {getStatusBadge(order.status)}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => startEditing(order.id, 'status', order.status)}
                              title="Modifica stato"
                              className="h-6 w-6 ml-1"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="Visualizza chat">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Dettagli ordine">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderList;
