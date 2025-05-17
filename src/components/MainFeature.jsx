import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { contactsService } from '../services/contactsService';

// Get icon components
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const EditIcon = getIcon('Edit2');
const TrashIcon = getIcon('Trash2');
const CheckIcon = getIcon('CheckCircle');
const XCircleIcon = getIcon('XCircle');
const UserIcon = getIcon('User');
const BuildingIcon = getIcon('Building');
const PhoneIcon = getIcon('Phone');
const MailIcon = getIcon('Mail');
const TagIcon = getIcon('Tag');
const CalendarIcon = getIcon('Calendar');
const ClockIcon = getIcon('Clock');
const AlertCircleIcon = getIcon('AlertCircle');
const CheckCircle2Icon = getIcon('CheckCircle2');
const RefreshCwIcon = getIcon('RefreshCw');
const FilterIcon = getIcon('Filter');
const ArrowUpDownIcon = getIcon('ArrowUpDown');
const MoreHorizontalIcon = getIcon('MoreHorizontal');

// Status color mapping
const statusColors = {
  Lead: 'badge-warning',
  Customer: 'badge-success',
  Partner: 'badge-info'
};

const MainFeature = ({
  contacts,
  onEdit,
  onDelete,
  isFormOpen,
  onCloseForm,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'Lead',
    tags: []
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle tag input
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
        e.target.value = '';
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open form for creating a new contact
  const openCreateForm = () => {
    setCurrentContact(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'Lead',
      tags: []
    });
    setErrors({});
    setIsFormOpen(true);
  };

  // Open form for editing an existing contact
  const openEditForm = (contact) => {
    setCurrentContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      title: contact.title,
      status: contact.status,
      tags: [...contact.tags]
    });
    setErrors({});
    setIsFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
  };

  // Sort contacts
  const sortContacts = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.firstName.toLowerCase().includes(searchLower) ||
        contact.lastName.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.company.toLowerCase().includes(searchLower) ||
        contact.phone.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      // Handle special case for full name
      if (sortField === 'name') {
        valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else {
        valueA = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
        valueB = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];
      }
      
      if (valueA < valueB) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-surface-800 dark:text-white">Contact Management</h2>
          <p className="text-surface-500 dark:text-surface-400 text-sm">Manage your contacts, customers and leads</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input py-2 pl-9 pr-4 w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-surface-400" />
            </div>
          </div>
          
          <button
            onClick={openCreateForm}
            className="btn-primary whitespace-nowrap"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Add Contact
          </button>
        </div>
      </div>
      
      {/* Contact table */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-100 dark:bg-surface-700/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => sortContacts('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {sortField === 'name' && (
                      <ArrowUpDownIcon className="h-3.5 w-3.5" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer" onClick={() => sortContacts('email')}>
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {sortField === 'email' && (
                      <ArrowUpDownIcon className="h-3.5 w-3.5" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => sortContacts('company')}>
                  <div className="flex items-center space-x-1">
                    <span>Company</span>
                    {sortField === 'company' && (
                      <ArrowUpDownIcon className="h-3.5 w-3.5" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCwIcon className="w-8 h-8 text-primary animate-spin mb-3" />
                      <p className="text-surface-600 dark:text-surface-400">Loading contacts...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircleIcon className="w-8 h-8 text-surface-400 mb-3" />
                      <p className="text-surface-600 dark:text-surface-400 mb-1">No contacts found</p>
                      <p className="text-surface-500 dark:text-surface-500 text-sm">
                        {searchTerm ? 'Try a different search term' : 'Add a new contact to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center text-primary-dark mr-3">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-surface-900 dark:text-white">
                            {`${contact.firstName} ${contact.lastName}`}
                          </div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">
                            {contact.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MailIcon className="h-4 w-4 text-surface-400 mr-2" />
                        <span className="text-surface-700 dark:text-surface-300">
                          {contact.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center">
                        <BuildingIcon className="h-4 w-4 text-surface-400 mr-2" />
                        <span className="text-surface-700 dark:text-surface-300">
                          {contact.company}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className={`${statusColors[contact.status] || 'badge-neutral'}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditForm(contact)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-primary hover:bg-surface-200 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700"
                          aria-label="Edit"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(contact.id)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:text-surface-400 dark:hover:text-red-400 dark:hover:bg-surface-700"
                          aria-label="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Contact form modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-surface-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-soft max-w-2xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-surface-800 dark:text-white">
                  {currentContact ? 'Edit Contact' : 'Add New Contact'}
                </h3>
                <button
                  onClick={closeForm}
                  className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Close"
                >
                  <XCircleIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`input ${errors.firstName ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`input ${errors.lastName ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input ${errors.email ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`input ${errors.company ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="select"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Customer">Customer</option>
                      <option value="Partner">Partner</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center bg-surface-200 dark:bg-surface-700 rounded-full px-2.5 py-1"
                        >
                          <TagIcon className="h-3.5 w-3.5 text-surface-500 dark:text-surface-400 mr-1" />
                          <span className="text-xs font-medium text-surface-700 dark:text-surface-300 mr-1">
                            {tag}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <XCircleIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add tags (press Enter)"
                        onKeyDown={handleTagInput}
                        className="input"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <TagIcon className="h-4 w-4 text-surface-400" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
                      Press Enter to add a tag
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="btn-outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary min-w-[120px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <RefreshCwIcon className="animate-spin h-5 w-5 mx-auto" />
                    ) : currentContact ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1.5" />
                        Update
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-1.5" />
                        Create
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;