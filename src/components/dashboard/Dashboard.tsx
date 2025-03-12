
import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import OrderList from './OrderList';

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
            <h1 className="text-2xl font-bold text-gray-900">Gestione Ordini</h1>
            
            <OrderList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
