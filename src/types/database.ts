
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage?: string;
  requiresPrescription: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'ready' | 'delivered' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  status: BookingStatus;
  medications: {
    medicationId: string;
    quantity: number;
    notes?: string;
  }[];
  prescriptionUrl?: string;
  pickupTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
  bookingId?: string;
  processed: boolean;
}

// Mock database for frontend development
export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Maria Rossi',
    phoneNumber: '+39123456789',
    email: 'maria.rossi@example.com',
    address: 'Via Roma 123, Milano',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    fullName: 'Giuseppe Verdi',
    phoneNumber: '+39987654321',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-20')
  },
  {
    id: '3',
    fullName: 'Anna Bianchi',
    phoneNumber: '+39456789123',
    email: 'anna.b@example.com',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  }
];

export const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Paracetamolo',
    description: 'Antidolorifico e antipiretico',
    dosage: '500mg',
    requiresPrescription: false,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Amoxicillina',
    description: 'Antibiotico',
    dosage: '1g',
    requiresPrescription: true,
    inStock: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '3',
    name: 'Ibuprofene',
    description: 'Antinfiammatorio',
    dosage: '600mg',
    requiresPrescription: false,
    inStock: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    status: 'confirmed',
    medications: [
      { medicationId: '1', quantity: 2 }
    ],
    pickupTime: new Date('2023-05-20T14:30:00'),
    createdAt: new Date('2023-05-19'),
    updatedAt: new Date('2023-05-19')
  },
  {
    id: '2',
    userId: '2',
    status: 'pending',
    medications: [
      { medicationId: '2', quantity: 1, notes: 'Serve la prescrizione' }
    ],
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-05-20')
  },
  {
    id: '3',
    userId: '3',
    status: 'delivered',
    medications: [
      { medicationId: '1', quantity: 1 },
      { medicationId: '3', quantity: 1 }
    ],
    pickupTime: new Date('2023-05-18T10:00:00'),
    createdAt: new Date('2023-05-17'),
    updatedAt: new Date('2023-05-18')
  },
  {
    id: '4',
    userId: '1',
    status: 'cancelled',
    medications: [
      { medicationId: '2', quantity: 1 }
    ],
    notes: 'Cliente ha annullato la richiesta',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-16')
  }
];

export const mockWhatsAppMessages: WhatsAppMessage[] = [
  {
    id: '1',
    from: '+39123456789',
    to: '+39000000000',
    body: 'Vorrei prenotare del Paracetamolo',
    timestamp: new Date('2023-05-19T09:30:00'),
    type: 'incoming',
    bookingId: '1',
    processed: true
  },
  {
    id: '2',
    from: '+39000000000',
    to: '+39123456789',
    body: 'La sua prenotazione è stata confermata. Può ritirare il farmaco alle 14:30 di domani.',
    timestamp: new Date('2023-05-19T09:35:00'),
    type: 'outgoing',
    bookingId: '1',
    processed: true
  },
  {
    id: '3',
    from: '+39987654321',
    to: '+39000000000',
    body: 'Ho bisogno di Amoxicillina. Ho la ricetta.',
    timestamp: new Date('2023-05-20T08:15:00'),
    type: 'incoming',
    bookingId: '2',
    processed: true
  },
  {
    id: '4',
    from: '+39000000000',
    to: '+39987654321',
    body: 'La sua richiesta è in elaborazione. La contatteremo per confermare.',
    timestamp: new Date('2023-05-20T08:20:00'),
    type: 'outgoing',
    bookingId: '2',
    processed: true
  }
];
