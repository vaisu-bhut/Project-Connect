import React, { useState } from 'react';

// Define interfaces for data types
interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  notes?: string;
}

interface Interaction {
  id: string;
  contact: string;
  date: string;
  type: string;
  notes: string;
}

interface Reminder {
  id: string;
  contact: string;
  date: string;
  task: string;
}

// Sample data
const contacts: Contact[] = [
  { id: '1', name: 'John Doe', company: 'ABC Inc.', email: 'john@example.com', phone: '123-456-7890', notes: 'Met at conference.' },
  { id: '2', name: 'Jane Smith', company: 'XYZ Corp.', email: 'jane@example.com', phone: '098-765-4321', notes: 'Potential client.' },
];

const interactions: Interaction[] = [
  { id: '1', contact: 'John Doe', date: '2023-10-01', type: 'Email', notes: 'Followed up on proposal.' },
  { id: '2', contact: 'Jane Smith', date: '2023-10-02', type: 'Call', notes: 'Discussed project details.' },
];

const reminders: Reminder[] = [
  { id: '1', contact: 'John Doe', date: '2023-10-15', task: 'Send follow-up email' },
  { id: '2', contact: 'Jane Smith', date: '2023-10-20', task: 'Schedule meeting' },
];

const login = () => {
    window.location.href = '/auth'
}

// Header component
const Header: React.FC = () => (
  <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold">Network Manager</h1>
    <div className="space-x-2">
      <button onClick={login} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
      <button onClick={login} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sign Up</button>
    </div>
  </header>
);

// Footer component
const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white p-4 text-center">
    <p>© 2023 Network Manager. All rights reserved.</p>
  </footer>
);

// Navigation component
interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: 'dashboard' | 'contacts' | 'interactions' | 'reminders') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => (
  <nav className="bg-gray-200 p-2">
    <ul className="flex space-x-4">
      <li>
        <button
          className={`px-3 py-2 rounded ${currentTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => onTabChange('dashboard')}
        >
          Dashboard
        </button>
      </li>
      <li>
        <button
          className={`px-3 py-2 rounded ${currentTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => onTabChange('contacts')}
        >
          Contacts
        </button>
      </li>
      <li>
        <button
          className={`px-3 py-2 rounded ${currentTab === 'interactions' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => onTabChange('interactions')}
        >
          Interactions
        </button>
      </li>
      <li>
        <button
          className={`px-3 py-2 rounded ${currentTab === 'reminders' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => onTabChange('reminders')}
        >
          Reminders
        </button>
      </li>
    </ul>
  </nav>
);

// Dashboard component
const Dashboard: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="mb-4">
      <h3 className="text-xl font-semibold">Network Statistics</h3>
      <p>Total Contacts: {contacts.length}</p>
      <p>Recent Interactions: {interactions.length}</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold">AI Suggestions</h3>
      <ul className="list-disc pl-5">
        <li>Reach out to John Doe</li>
        <li>Follow up with Jane Smith</li>
      </ul>
    </div>
  </div>
);

// Contacts component (list view)
interface ContactsProps {
  contacts: Contact[];
  onContactSelect: (id: string) => void;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, onContactSelect }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Contacts</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {contacts.map(contact => (
        <div
          key={contact.id}
          className="border border-gray-300 p-4 rounded hover:bg-gray-100 cursor-pointer"
          onClick={() => onContactSelect(contact.id)}
        >
          <h4 className="font-semibold">{contact.name}</h4>
          <p>{contact.company}</p>
          <p>{contact.email}</p>
        </div>
      ))}
    </div>
  </div>
);

// ContactDetail component (detailed view)
interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onBack }) => (
  <div>
    <button onClick={onBack} className="mb-4 bg-gray-500 text-white py-2 px-4 rounded">Back to List</button>
    <h2 className="text-2xl font-bold mb-4">{contact.name}</h2>
    <p><strong>Company:</strong> {contact.company}</p>
    <p><strong>Email:</strong> {contact.email}</p>
    {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
    {contact.notes && <p><strong>Notes:</strong> {contact.notes}</p>}
  </div>
);

// Interactions component
interface InteractionsProps {
  interactions: Interaction[];
}

const Interactions: React.FC<InteractionsProps> = ({ interactions }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Interactions</h2>
    <ul className="list-disc pl-5">
      {interactions.map(interaction => (
        <li key={interaction.id}>
          {interaction.date} - {interaction.contact} ({interaction.type}): {interaction.notes}
        </li>
      ))}
    </ul>
  </div>
);

// Reminders component
interface RemindersProps {
  reminders: Reminder[];
}

const Reminders: React.FC<RemindersProps> = ({ reminders }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Reminders</h2>
    <ul className="list-disc pl-5">
      {reminders.map(reminder => (
        <li key={reminder.id}>
          {reminder.date} - {reminder.contact}: {reminder.task}
        </li>
      ))}
    </ul>
  </div>
);

// Main App component
const NetworkManagerApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'contacts' | 'interactions' | 'reminders'>('dashboard');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const handleTabChange = (tab: 'dashboard' | 'contacts' | 'interactions' | 'reminders') => {
    setCurrentTab(tab);
    setSelectedContactId(null); // Reset selected contact when changing tabs
  };

  const handleContactSelect = (id: string) => {
    setSelectedContactId(id);
  };

  const handleBackToList = () => {
    setSelectedContactId(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
      <main className="flex-grow p-4">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'contacts' && (
          selectedContactId ? (
            <ContactDetail contact={contacts.find(c => c.id === selectedContactId)!} onBack={handleBackToList} />
          ) : (
            <Contacts contacts={contacts} onContactSelect={handleContactSelect} />
          )
        )}
        {currentTab === 'interactions' && <Interactions interactions={interactions} />}
        {currentTab === 'reminders' && <Reminders reminders={reminders} />}
      </main>
      <Footer />
    </div>
  );
};

export default NetworkManagerApp;