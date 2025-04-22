import { InteractionBase } from '@/types';

export const dummyInteractions: InteractionBase[] = [
  {
    _id: '1',
    title: 'Initial Meeting',
    type: 'meeting',
    date: new Date('2024-03-15'),
    contacts: [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        category: 'Work',
        tags: ['developer', 'frontend'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    notes: 'Discussed project requirements and timeline',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    _id: '2',
    title: 'Follow-up Call',
    type: 'call',
    date: new Date('2024-03-20'),
    contacts: [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        category: 'Work',
        tags: ['developer', 'frontend'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    notes: 'Clarified technical requirements and discussed implementation details',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  },
  {
    _id: '3',
    title: 'Project Review',
    type: 'meeting',
    date: new Date('2024-04-01'),
    contacts: [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        category: 'Work',
        tags: ['developer', 'frontend'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    notes: 'Reviewed project progress and discussed next steps',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    _id: '4',
    title: 'Email Exchange',
    type: 'email',
    date: new Date('2024-04-05'),
    contacts: [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        category: 'Work',
        tags: ['developer', 'frontend'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    notes: 'Sent project documentation and received feedback',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  },
  {
    _id: '5',
    title: 'Final Presentation',
    type: 'meeting',
    date: new Date('2024-04-15'),
    contacts: [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        category: 'Work',
        tags: ['developer', 'frontend'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    notes: 'Presented final project deliverables and discussed future collaboration',
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15')
  }
]; 