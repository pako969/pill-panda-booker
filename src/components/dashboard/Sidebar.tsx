
import React from 'react';
import { 
  Home, 
  ShoppingBag,  
  Settings,
  LogOut,
  Pill,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out", 
      isOpen ? "w-64" : "w-0 lg:w-16"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {isOpen && (
          <div className="font-bold text-xl text-pharma flex items-center">
            <Pill className="mr-2 h-6 w-6" />
            <span>Sanime</span>
          </div>
        )}
        {!isOpen && (
          <div className="mx-auto text-pharma">
            <Pill className="h-6 w-6" />
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <NavItem icon={<Home />} label="Dashboard" isOpen={isOpen} isActive={true} />
          <NavItem icon={<ShoppingBag />} label="Ordini" isOpen={isOpen} />
        </ul>
      </nav>
      
      <div className="p-2 border-t border-gray-200">
        <ul className="space-y-1">
          <NavItem icon={<Settings />} label="Impostazioni" isOpen={isOpen} />
          <NavItem icon={<LogOut />} label="Esci" isOpen={isOpen} />
        </ul>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isOpen, isActive = false }) => {
  return (
    <li>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start px-3",
          isActive && "bg-pharma-light/20 text-pharma-dark",
          isActive && !isOpen && "bg-pharma-light/20"
        )}
      >
        <span className={cn("mr-2", !isOpen && "mr-0")}>{icon}</span>
        {isOpen && <span>{label}</span>}
      </Button>
    </li>
  );
};

export default Sidebar;
