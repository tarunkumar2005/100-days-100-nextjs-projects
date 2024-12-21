import { FormField } from '@/types/form';

interface Template {
  name: string;
  description: string;
  fields: FormField[];
}

export const templates: Template[] = [
  {
    name: 'Job Application',
    description: 'An application form for job seekers with fields for work experience and qualifications.',
    fields: [
      {
        type: 'text',
        name: 'fullName',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        type: 'text',
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
        validation: {
          required: true,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
      },
      {
        type: 'text',
        name: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        required: true,
        validation: {
          required: true,
          pattern: '^[0-9+-]+$',
        },
      },
      {
        type: 'dropdown',
        name: 'position',
        label: 'Position Applying For',
        required: true,
        options: [
          { value: 'software-engineer', label: 'Software Engineer' },
          { value: 'product-manager', label: 'Product Manager' },
          { value: 'data-analyst', label: 'Data Analyst' },
          { value: 'ux-designer', label: 'UX Designer' },
        ],
      },
      {
        type: 'textarea',
        name: 'experience',
        label: 'Work Experience',
        placeholder: 'Describe your relevant work experience',
        required: true,
      },
      {
        type: 'textarea',
        name: 'education',
        label: 'Education',
        placeholder: 'List your educational qualifications',
        required: true,
      },
      {
        type: 'file',
        name: 'resume',
        label: 'Resume',
        required: true,
        validation: {
          required: true,
          acceptedFiles: '.pdf,.doc,.docx',
        },
      },
      {
        type: 'checkbox',
        name: 'terms',
        label: 'I agree to the terms and conditions',
        required: true,
      },
    ],
  },
  {
    name: 'Event Registration',
    description: 'A form for event registration with fields for personal details and event preferences.',
    fields: [
      {
        type: 'text',
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        type: 'text',
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email address',
        required: true,
        validation: {
          required: true,
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        },
      },
      {
        type: 'dropdown',
        name: 'eventType',
        label: 'Event Type',
        required: true,
        options: [
          { value: 'conference', label: 'Conference' },
          { value: 'workshop', label: 'Workshop' },
          { value: 'seminar', label: 'Seminar' },
        ],
      },
      {
        type: 'date',
        name: 'date',
        label: 'Preferred Date',
        required: true,
      },
      {
        type: 'checkbox',
        name: 'dietary',
        label: 'Do you have any dietary requirements?',
        required: false,
      },
    ],
  },
];