
import React from 'react';
import { Search, Bell, Calendar, MessageSquare, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-2 lg:gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="font-semibold text-lg text-pharma-dark flex items-center gap-2">
          <span className="hidden md:inline">Sanime</span>
          <span className="inline md:hidden">S</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center flex-1 mx-4 lg:mx-8 relative">
        <Search className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
        <Input 
          placeholder="Cerca prenotazioni, clienti, farmaci..." 
          className="pl-10 w-full max-w-md" 
        />
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pharma text-white">3</Badge>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Calendar className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pharma text-white">2</Badge>
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-pharma text-white flex items-center justify-center font-medium">
          AF
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
