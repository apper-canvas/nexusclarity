// Initial sample data
const initialContacts = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Inc.',
    title: 'Sales Manager',
    status: 'Customer',
    tags: ['VIP', 'Sales'],
    createdAt: '2023-04-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.j@example.com',
    phone: '(555) 987-6543',
    company: 'Tech Solutions',
    title: 'Marketing Director',
    status: 'Lead',
    tags: ['Marketing'],
    createdAt: '2023-05-22T14:45:00Z'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'michael.w@example.com',
    phone: '(555) 456-7890',
    company: 'Global Enterprises',
    title: 'CEO',
    status: 'Partner',
    tags: ['VIP', 'Executive'],
    createdAt: '2023-03-10T09:15:00Z'
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Brown',
    email: 'sarah.b@example.com',
    phone: '(555) 234-5678',
    company: 'Design Studio',
    title: 'Creative Director',
    status: 'Lead',
    tags: ['Design'],
    createdAt: '2023-06-05T11:20:00Z'
  }
];

// Initialize contacts in localStorage if not already present
const initializeContacts = () => {
  const contacts = localStorage.getItem('contacts');
  if (!contacts) {
    localStorage.setItem('contacts', JSON.stringify(initialContacts));
  }
};

// Get all contacts
const getContacts = () => {
  initializeContacts();
  return JSON.parse(localStorage.getItem('contacts') || '[]');
};

// Get a contact by id
const getContactById = (id) => {
  const contacts = getContacts();
  return contacts.find(contact => contact.id === id) || null;
};

// Create a new contact
const createContact = (contactData) => {
  const contacts = getContacts();
  const newContact = {
    id: Date.now().toString(),
    ...contactData,
    createdAt: new Date().toISOString()
  };
  
  contacts.push(newContact);
  localStorage.setItem('contacts', JSON.stringify(contacts));
  return newContact;
};

// Update an existing contact
const updateContact = (id, contactData) => {
  const contacts = getContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  
  if (index === -1) {
    throw new Error('Contact not found');
  }
  
  const updatedContact = {
    ...contacts[index],
    ...contactData,
    updatedAt: new Date().toISOString()
  };
  
  contacts[index] = updatedContact;
  localStorage.setItem('contacts', JSON.stringify(contacts));
  return updatedContact;
};

// Delete a contact
const deleteContact = (id) => {
  const contacts = getContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== id);
  
  localStorage.setItem('contacts', JSON.stringify(filteredContacts));
  return true;
};

// Get all unique companies for filtering
const getUniqueCompanies = () => {
  const contacts = getContacts();
  const companies = [...new Set(contacts.map(contact => contact.company))];
  return companies.sort();
};

export const contactsService = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getUniqueCompanies,
  initializeContacts
};