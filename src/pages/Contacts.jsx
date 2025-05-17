import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { contactsService } from '../services/contactsService';
import { filterByText, filterByDateRange, formatDate } from '../utils/filterUtils';

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
const RefreshCwIcon = getIcon('RefreshCw');
const AlertCircleIcon = getIcon('AlertCircle');
const FilterIcon = getIcon('Filter');
const ArrowUpDownIcon = getIcon('ArrowUpDown');
const ChevronDownIcon = getIcon('ChevronDown');

// Status color mapping
const statusColors = {
  Lead: 'badge-warning',
  Customer: 'badge-success',
  Partner: 'badge-info'
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [errors, setErrors] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    company: 'all',
    dateRange: 'all'
  });
  const [companies, setCompanies] = useState([]);
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

  // Load contacts on component mount
  useEffect(() => {
    let isMounted = true;
    
    async function loadContacts() {
      try {
        setIsLoading(true);
        
        // Fetch contacts from database
        const data = await contactsService.getContacts();
        if (isMounted) {
          setContacts(data);
          
          // Get unique companies for filtering
          const uniqueCompanies = await contactsService.getUniqueCompanies();
          setCompanies(uniqueCompanies);
        }
      } catch (error) {
        toast.error('Failed to load contacts');
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadContacts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...contacts];

    // Apply text search
    result = filterByText(result, searchTerm, [
      'firstName', 
      'lastName', 
      'email', 
      'phone', 
      'company',
      'title'
    ]);

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(contact => contact.status === filters.status);
    }

    // Apply company filter
    if (filters.company !== 'all') {
      result = result.filter(contact => contact.company === filters.company);
    }

    // Apply date range filter
    result = filterByDateRange(result, 'createdAt', filters.dateRange);

    // Apply sorting
    result.sort((a, b) => {
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

    setFilteredContacts(result);
  }, [contacts, searchTerm, filters, sortField, sortDirection]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (currentContact) {
        // Update existing contact
        const updatedContact = await contactsService.updateContact(currentContact.id, formData);
        setContacts(prev => prev.map(contact => 
          contact.id === currentContact.id ? updatedContact : contact
        ));
        toast.success('Contact updated successfully!');
      } else {
        // Create new contact
        const newContact = await contactsService.createContact(formData);
        setContacts(prev => [...prev, newContact]);
        toast.success('Contact created successfully!');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error.message || 'An error occurred while saving the contact');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete contact
  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setIsLoading(true);
      
      try {
        await contactsService.deleteContact(id);
        // Update contacts list after deletion
        const updatedContacts = await contactsService.getContacts();
        setContacts(updatedContacts);
        toast.success('Contact deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete contact');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Sort contacts
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      company: 'all',
      dateRange: 'all'
    });
    setSearchTerm('');
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-surface-800 dark:text-white">Contacts</h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              Manage your contacts, customers and leads
            </p>
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
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline whitespace-nowrap"
            >
              <FilterIcon className="h-4 w-4 mr-1.5" />
              Filters
              <ChevronDownIcon className={`h-4 w-4 ml-1.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={openCreateForm}
              className="btn-primary whitespace-nowrap"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Add Contact
            </button>
          </div>
        </div>
        
        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-4 border border-surface-200 dark:border-surface-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Lead">Lead</option>
                    <option value="Customer">Customer</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Company
                  </label>
                  <select
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    className="select"
                  >
                    <option value="all">All Companies</option>
                    {companies.map(company => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Created Date
                  </label>
                  <select
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                    className="select"
                  >
                    <option value="all">All Time</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="last90days">Last 90 Days</option>
                  </select>
                </div>
                
                <div className="md:col-span-3 flex justify-end">
                  <button 
                    onClick={resetFilters}
                    className="btn-outline text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Import the MainFeature component which contains the contacts table and form */}
      <div className="mt-6">
        {isLoading && contacts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl shadow-card">
            <RefreshCwIcon className="w-8 h-8 text-primary animate-spin mb-3 mx-auto" />
            <p className="text-surface-600 dark:text-surface-400">Loading contacts...</p>
          </div>
        ) : (
          <MainFeature
            contacts={filteredContacts}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEdit={openEditForm}
            onDelete={handleDeleteContact}
            currentContact={currentContact}
            isFormOpen={isFormOpen}
            formData={formData}
            errors={errors}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onTagInput={handleTagInput}
            onRemoveTag={removeTag}
            onCloseForm={closeForm}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

// Import the MainFeature component from components folder
import MainFeature from '../components/MainFeature';

export default Contacts;