export interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    avatar: string;
    lastContacted?: string; // ISO date string
  }
  
  const generateRandomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
  };
  
  // Function to generate a random avatar URL
  const getRandomAvatar = (id: string): string => {
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const number = parseInt(id, 10) % 100;
    return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
  };
  
  export const contactsData: Contact[] = [
    {
      id: '1',
      name: 'John Smith',
      phoneNumber: '+1 (555) 123-4567',
      email: 'john.smith@example.com',
      avatar: getRandomAvatar('1'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '2',
      name: 'Emily Johnson',
      phoneNumber: '+1 (555) 234-5678',
      email: 'emily.johnson@example.com',
      avatar: getRandomAvatar('2'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '3',
      name: 'Michael Brown',
      phoneNumber: '+1 (555) 345-6789',
      email: 'michael.brown@example.com',
      avatar: getRandomAvatar('3'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '4',
      name: 'Jessica Davis',
      phoneNumber: '+1 (555) 456-7890',
      email: 'jessica.davis@example.com',
      avatar: getRandomAvatar('4'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '5',
      name: 'David Miller',
      phoneNumber: '+1 (555) 567-8901',
      email: 'david.miller@example.com',
      avatar: getRandomAvatar('5'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '6',
      name: 'Sarah Wilson',
      phoneNumber: '+1 (555) 678-9012',
      email: 'sarah.wilson@example.com',
      avatar: getRandomAvatar('6'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '7',
      name: 'Robert Taylor',
      phoneNumber: '+1 (555) 789-0123',
      email: 'robert.taylor@example.com',
      avatar: getRandomAvatar('7'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '8',
      name: 'Jennifer Anderson',
      phoneNumber: '+1 (555) 890-1234',
      email: 'jennifer.anderson@example.com',
      avatar: getRandomAvatar('8'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
    {
      id: '9',
      name: 'William Thomas',
      phoneNumber: '+1 (555) 901-2345',
      email: 'william.thomas@example.com',
      avatar: getRandomAvatar('9'),
      lastContacted: generateRandomDate(new Date(2023, 0, 1), new Date())
    },
   
  ];
  
  // Helper function to get all contacts
  export const getAllContacts = (): Contact[] => {
    return contactsData;
  };
  
  // Helper function to search contacts by name
  export const searchContactsByName = (query: string): Contact[] => {
    const searchTerm = query.toLowerCase().trim();
    return contactsData.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm)
    );
  };