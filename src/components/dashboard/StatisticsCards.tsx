
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, CheckCircle2, Clock, Users } from 'lucide-react';
import { mockBookings, mockUsers } from '@/types/database';

const StatisticsCards: React.FC = () => {
  // Calculate statistics from mock data
  // In a real app, this would fetch data from an API
  const totalBookings = mockBookings.length;
  const pendingBookings = mockBookings.filter(b => b.status === 'pending').length;
  const completedBookings = mockBookings.filter(b => ['delivered', 'ready'].includes(b.status)).length;
  const totalUsers = mockUsers.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Prenotazioni Totali" 
        value={totalBookings} 
        icon={<ShoppingBag className="h-8 w-8 text-pharma" />}
        trend={+15}
      />
      <StatCard 
        title="In Attesa" 
        value={pendingBookings} 
        icon={<Clock className="h-8 w-8 text-amber-500" />}
        trend={+5}
      />
      <StatCard 
        title="Completate" 
        value={completedBookings} 
        icon={<CheckCircle2 className="h-8 w-8 text-green-500" />}
        trend={+8}
      />
      <StatCard 
        title="Clienti" 
        value={totalUsers} 
        icon={<Users className="h-8 w-8 text-blue-500" />}
        trend={+3}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
          {trend !== undefined && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% rispetto alla settimana scorsa
            </p>
          )}
        </div>
        <div className="rounded-full bg-muted p-2">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCards;
