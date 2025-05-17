// Get reports from database
const getReports = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('report', {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'description', 'type',
        'chartType', 'entity', 'fields', 'filters'
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    });

    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(report => {
      // Parse filters if they are stored as a string
      let parsedFilters = [];
      if (report.filters) {
        try {
          parsedFilters = typeof report.filters === 'string' ? 
            JSON.parse(report.filters) : report.filters;
        } catch (e) {
          console.error('Error parsing filters:', e);
        }
      }
      
      return {
        id: report.Id,
        name: report.Name || '',
        description: report.description || '',
        type: report.type || 'table',
        chartType: report.chartType || 'table',
        entity: report.entity || '',
        fields: report.fields || [],
        filters: parsedFilters,
        tags: report.Tags || [],
        createdAt: report.CreatedOn,
        createdBy: report.CreatedBy,
        modifiedOn: report.ModifiedOn
      };
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

// Get report by ID
const getReportById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('report', id);
    
    if (!response || !response.data) {
      return null;
    }
    
    const report = response.data;
    
    // Parse filters if they are stored as a string
    let parsedFilters = [];
    if (report.filters) {
      try {
        parsedFilters = typeof report.filters === 'string' ? 
          JSON.parse(report.filters) : report.filters;
      } catch (e) {
        console.error('Error parsing filters:', e);
      }
    }
    
    return {
      id: report.Id,
      name: report.Name || '',
      description: report.description || '',
      type: report.type || 'table',
      chartType: report.chartType || 'table',
      entity: report.entity || '',
      fields: report.fields || [],
      filters: parsedFilters,
      tags: report.Tags || [],
      createdAt: report.CreatedOn,
      createdBy: report.CreatedBy,
      modifiedOn: report.ModifiedOn
    };
  } catch (error) {
    console.error(`Error fetching report with ID ${id}:`, error);
    throw error;
  }
};

// Create a new report in the database
const createReport = async (reportData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // CRITICAL: Only include fields with visibility: "Updateable"
    // Stringify filters array to store as text if needed
    const filtersString = typeof reportData.filters === 'object' ? 
      JSON.stringify(reportData.filters) : reportData.filters;
      
    const newReport = {
      Name: reportData.name,
      Tags: reportData.tags || [],
      description: reportData.description || '',
      type: reportData.type || 'table',
      chartType: reportData.chartType || 'table',
      entity: reportData.entity || '',
      fields: reportData.fields || [],
      filters: filtersString
    };

    const response = await apperClient.createRecord('report', { records: [newReport] });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to create report');
    }
    
    const createdRecord = response.results[0].data;
    return {
      id: createdRecord.Id,
      name: createdRecord.Name || '',
      description: createdRecord.description || '',
      type: createdRecord.type || 'table',
      chartType: createdRecord.chartType || 'table',
      entity: createdRecord.entity || '',
      fields: createdRecord.fields || [],
      filters: reportData.filters, // Use the original filters object
      tags: createdRecord.Tags || [],
      createdAt: createdRecord.CreatedOn
    };
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

// Update an existing report in the database
const updateReport = async (id, reportData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // CRITICAL: Only include fields with visibility: "Updateable" plus the ID
    // Stringify filters array to store as text if needed
    const filtersString = typeof reportData.filters === 'object' ? 
      JSON.stringify(reportData.filters) : reportData.filters;
      
    const updatedReport = {
      Id: id,
      Name: reportData.name,
      Tags: reportData.tags || [],
      description: reportData.description || '',
      type: reportData.type || 'table',
      chartType: reportData.chartType || 'table',
      entity: reportData.entity || '',
      fields: reportData.fields || [],
      filters: filtersString
    };
    
    const response = await apperClient.updateRecord('report', { records: [updatedReport] });
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to update report');
    }
    
    const updatedRecord = response.results[0].data;
    return {
      id: updatedRecord.Id,
      name: updatedRecord.Name || '',
      description: updatedRecord.description || '',
      type: updatedRecord.type || 'table',
      chartType: updatedRecord.chartType || 'table',
      entity: updatedRecord.entity || '',
      fields: updatedRecord.fields || [],
      filters: reportData.filters, // Use the original filters object
      tags: updatedRecord.Tags || [],
      createdAt: updatedRecord.CreatedOn,
      modifiedOn: updatedRecord.ModifiedOn
    };
  } catch (error) {
    console.error(`Error updating report with ID ${id}:`, error);
    throw error;
  }
};

// Delete a report from the database
const deleteReport = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord('report', { RecordIds: [id] });
    
    if (!response || !response.success) {
      throw new Error('Failed to delete report');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting report with ID ${id}:`, error);
    throw error;
  }
};

export const reportService = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
};