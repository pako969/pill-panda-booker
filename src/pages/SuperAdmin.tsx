
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Plus, User, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock pharmacy users (would come from a real API/database)
type Pharmacy = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

const SuperAdmin: React.FC = () => {
  const { user } = useAuth();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: '1',
      name: 'Farmacia Centrale',
      email: 'farmacia@example.com',
      createdAt: new Date('2023-01-01')
    }
  ]);
  
  const [newPharmacy, setNewPharmacy] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePharmacy = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPharmacy.name || !newPharmacy.email || !newPharmacy.password) {
      toast.error('Compila tutti i campi');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newId = (pharmacies.length + 1).toString();
      
      const pharmacy: Pharmacy = {
        id: newId,
        name: newPharmacy.name,
        email: newPharmacy.email,
        createdAt: new Date()
      };
      
      setPharmacies([...pharmacies, pharmacy]);
      setNewPharmacy({ name: '', email: '', password: '' });
      toast.success(`Farmacia ${newPharmacy.name} creata con successo`);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDeletePharmacy = (id: string) => {
    setPharmacies(pharmacies.filter(pharmacy => pharmacy.id !== id));
    toast.success('Farmacia eliminata con successo');
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Pannello Super Admin</h1>
        <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 font-medium text-sm">
          {user?.name}
        </div>
      </div>
      
      <Tabs defaultValue="credentials">
        <TabsList className="mb-6">
          <TabsTrigger value="credentials">Gestione Farmacie</TabsTrigger>
          <TabsTrigger value="settings">Impostazioni</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crea Nuova Farmacia</CardTitle>
              <CardDescription>
                Aggiungi una nuova farmacia alla piattaforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePharmacy} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="pharmacy-name" className="text-sm font-medium">Nome Farmacia</label>
                    <Input
                      id="pharmacy-name"
                      value={newPharmacy.name}
                      onChange={(e) => setNewPharmacy({...newPharmacy, name: e.target.value})}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pharmacy-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="pharmacy-email"
                      type="email"
                      value={newPharmacy.email}
                      onChange={(e) => setNewPharmacy({...newPharmacy, email: e.target.value})}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="pharmacy-password" className="text-sm font-medium">Password</label>
                  <Input
                    id="pharmacy-password"
                    type="password"
                    value={newPharmacy.password}
                    onChange={(e) => setNewPharmacy({...newPharmacy, password: e.target.value})}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creazione in corso...' : 'Crea Farmacia'}
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Farmacie</CardTitle>
              <CardDescription>
                Gestisci le farmacie registrate nella piattaforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Data Creazione</th>
                      <th className="text-right py-3 px-4">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pharmacies.map((pharmacy) => (
                      <tr key={pharmacy.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{pharmacy.id}</td>
                        <td className="py-3 px-4">{pharmacy.name}</td>
                        <td className="py-3 px-4">{pharmacy.email}</td>
                        <td className="py-3 px-4">
                          {pharmacy.createdAt.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeletePharmacy(pharmacy.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Elimina
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Sistema</CardTitle>
              <CardDescription>
                Configura le impostazioni globali della piattaforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funzionalità in sviluppo. Disponibile in un aggiornamento futuro.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdmin;
