
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import StatisticsCards from './StatisticsCards';
import BookingList from './BookingList';
import RecentMessages from './RecentMessages';
import WebhookConfig from './WebhookConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <DashboardHeader toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
            <StatisticsCards />
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Panoramica</TabsTrigger>
                <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
                <TabsTrigger value="config">Configurazione</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BookingList />
                  <RecentMessages />
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="space-y-6 mt-6">
                <BookingList 
                  title="Tutte le prenotazioni" 
                  description="Gestisci le prenotazioni dei clienti" 
                  limit={10} 
                />
              </TabsContent>
              
              <TabsContent value="config" className="space-y-6 mt-6">
                <WebhookConfig />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
