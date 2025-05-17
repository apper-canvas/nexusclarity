// Get contacts from database
const getContacts = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('contact1', {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'firstName', 'lastName', 
        'email', 'phone', 'company', 'title', 'status'
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    });

    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(contact => {
      return {
        id: contact.Id,
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        title: contact.title || '',
        status: contact.status || 'Lead',
        tags: contact.Tags || [],
        name: contact.Name,
        createdAt: contact.CreatedOn,
        createdBy: contact.CreatedBy,
        modifiedOn: contact.ModifiedOn
      };
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

// Get contact by ID
const getContactById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('contact1', id);
    
    if (!response || !response.data) {
      return null;
    }
    
    const contact = response.data;
    return {
      id: contact.Id,
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      title: contact.title || '',
      status: contact.status || 'Lead',
      tags: contact.Tags || [],
      name: contact.Name,
      createdAt: contact.CreatedOn,
      createdBy: contact.CreatedBy,
      modifiedOn: contact.ModifiedOn
    };
  } catch (error) {
    console.error(`Error fetching contact with ID ${id}:`, error);
    throw error;
  }
};

// Create a new contact in the database
const createContact = async (contactData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // CRITICAL: Only include fields with visibility: "Updateable"
    const newContact = {
      Name: `${contactData.firstName} ${contactData.lastName}`,
      Tags: contactData.tags,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      company: contactData.company,
      title: contactData.title,
      status: contactData.status
    };

    const response = await apperClient.createRecord('contact1', { records: [newContact] });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to create contact');
    }
    
    const createdRecord = response.results[0].data;
    return {
      id: createdRecord.Id,
      firstName: createdRecord.firstName || '',
      lastName: createdRecord.lastName || '',
      email: createdRecord.email || '',
      phone: createdRecord.phone || '',
      company: createdRecord.company || '',
      title: createdRecord.title || '',
      status: createdRecord.status || 'Lead',
      tags: createdRecord.Tags || [],
      name: createdRecord.Name,
      createdAt: createdRecord.CreatedOn
    };
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

// Update an existing contact in the database
const updateContact = async (id, contactData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // CRITICAL: Only include fields with visibility: "Updateable" plus the ID
    const updatedContact = {
      Id: id,
      Name: `${contactData.firstName} ${contactData.lastName}`,
      Tags: contactData.tags,
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email, 
      phone: contactData.phone,
      company: contactData.company,
      title: contactData.title,
      status: contactData.status
    };
    
    const response = await apperClient.updateRecord('contact1', { records: [updatedContact] });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to update contact');
    }
    
    const updatedRecord = response.results[0].data;
    return {
      id: updatedRecord.Id,
      firstName: updatedRecord.firstName || '',
      lastName: updatedRecord.lastName || '',
      email: updatedRecord.email || '',
      phone: updatedRecord.phone || '',
      company: updatedRecord.company || '',
      title: updatedRecord.title || '',
      status: updatedRecord.status || 'Lead',
      tags: updatedRecord.Tags || [],
      name: updatedRecord.Name,
      createdAt: updatedRecord.CreatedOn,
      modifiedOn: updatedRecord.ModifiedOn
    };
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
};

// Delete a contact from the database
const deleteContact = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord('contact1', { RecordIds: [id] });
    
    if (!response || !response.success) {
      throw new Error('Failed to delete contact');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};

// Get all unique companies for filtering
const getUniqueCompanies = async () => {
  try {
    const contacts = await getContacts();
    const companies = [...new Set(contacts.map(contact => contact.company).filter(Boolean))];
    return companies.sort();
  } catch (error) {
    console.error('Error getting unique companies:', error);
    return [];
  }
};

export const contactsService = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getUniqueCompanies
};