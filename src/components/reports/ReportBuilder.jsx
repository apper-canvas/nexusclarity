import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import ReportVisualization from './ReportVisualization';

// Get icon components
const SliderIcon = getIcon('Sliders');
const LayersIcon = getIcon('Layers');
const FilterIcon = getIcon('Filter');
const BarChartIcon = getIcon('BarChart');
const EyeIcon = getIcon('Eye');
const SaveIcon = getIcon('Save');
const XCircleIcon = getIcon('XCircle');
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash2');
const RefreshCwIcon = getIcon('RefreshCw');
const TableIcon = getIcon('Table');
const PieChartIcon = getIcon('PieChart');
const LineChartIcon = getIcon('LineChart');
const AreaChartIcon = getIcon('TrendingUp');

// Available entities and their fields
const entities = {
  contacts: {
    name: 'Contacts',
    fields: [
      { id: 'firstName', name: 'First Name', type: 'text' },
      { id: 'lastName', name: 'Last Name', type: 'text' },
      { id: 'email', name: 'Email', type: 'text' },
      { id: 'phone', name: 'Phone', type: 'text' },
      { id: 'company', name: 'Company', type: 'text' },
      { id: 'title', name: 'Job Title', type: 'text' },
      { id: 'status', name: 'Status', type: 'select', options: ['Lead', 'Customer', 'Partner'] },
      { id: 'tags', name: 'Tags', type: 'array' },
      { id: 'createdAt', name: 'Created Date', type: 'date' },
      { id: 'lastActivity', name: 'Last Activity Date', type: 'date' }
    ]
  },
  deals: {
    name: 'Deals',
    fields: [
      { id: 'name', name: 'Deal Name', type: 'text' },
      { id: 'amount', name: 'Amount', type: 'number' },
      { id: 'stage', name: 'Stage', type: 'select', options: ['Prospect', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] },
      { id: 'priority', name: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
      { id: 'probability', name: 'Probability (%)', type: 'number' },
      { id: 'contactId', name: 'Contact', type: 'relation', entity: 'contacts' },
      { id: 'companyId', name: 'Company', type: 'relation', entity: 'companies' },
      { id: 'closeDate', name: 'Expected Close Date', type: 'date' },
      { id: 'createdAt', name: 'Created Date', type: 'date' },
      { id: 'lastUpdated', name: 'Last Updated', type: 'date' }
    ]
  },
  tasks: {
    name: 'Tasks',
    fields: [
      { id: 'title', name: 'Task Title', type: 'text' },
      { id: 'description', name: 'Description', type: 'text' },
      { id: 'status', name: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Completed', 'Deferred'] },
      { id: 'priority', name: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
      { id: 'assignedTo', name: 'Assigned To', type: 'text' },
      { id: 'relatedTo', name: 'Related To', type: 'text' },
      { id: 'dueDate', name: 'Due Date', type: 'date' },
      { id: 'completedAt', name: 'Completed Date', type: 'date' },
      { id: 'createdAt', name: 'Created Date', type: 'date' }
    ]
  }
};

// Available operators for filters
const operators = [
  { id: 'equals', name: 'Equals', types: ['text', 'number', 'select', 'relation'] },
  { id: 'notEquals', name: 'Does Not Equal', types: ['text', 'number', 'select', 'relation'] },
  { id: 'contains', name: 'Contains', types: ['text', 'array'] },
  { id: 'notContains', name: 'Does Not Contain', types: ['text', 'array'] },
  { id: 'greaterThan', name: 'Greater Than', types: ['number', 'date'] },
  { id: 'lessThan', name: 'Less Than', types: ['number', 'date'] },
  { id: 'between', name: 'Between', types: ['number', 'date'] },
  { id: 'inTheLast', name: 'In the Last', types: ['date'] },
  { id: 'isNull', name: 'Is Empty', types: ['text', 'number', 'date', 'select', 'relation', 'array'] },
  { id: 'isNotNull', name: 'Is Not Empty', types: ['text', 'number', 'date', 'select', 'relation', 'array'] }
];

// Available visualization types
const visualizationTypes = [
  { id: 'table', name: 'Table', icon: TableIcon },
  { id: 'bar', name: 'Bar Chart', icon: BarChartIcon },
  { id: 'line', name: 'Line Chart', icon: LineChartIcon },
  { id: 'pie', name: 'Pie Chart', icon: PieChartIcon },
  { id: 'area', name: 'Area Chart', icon: AreaChartIcon }
];

const ReportBuilder = ({ initialReport, onSave, onCancel }) => {
  const [activeStep, setActiveStep] = useState('fields');
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [visualizationType, setVisualizationType] = useState('table');
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize form with existing report data if editing
  useEffect(() => {
    if (initialReport) {
      setReportName(initialReport.name);
      setReportDescription(initialReport.description || '');
      setSelectedEntity(initialReport.entity);
      setSelectedFields(initialReport.fields || []);
      setFilters(initialReport.filters || []);
      setVisualizationType(initialReport.chartType || 'table');
      
      // Generate preview for the initial report
      if (initialReport.entity && initialReport.fields && initialReport.fields.length > 0) {
        generateReportPreview(initialReport.entity, initialReport.fields, initialReport.filters);
      }
    }
  }, [initialReport]);

  // Handle entity selection
  const handleEntityChange = (e) => {
    const newEntity = e.target.value;
    setSelectedEntity(newEntity);
    setSelectedFields([]);
    setFilters([]);
    setValidationErrors({});
  };

  // Handle field selection
  const toggleFieldSelection = (fieldId) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  // Add a new filter
  const addFilter = () => {
    if (selectedEntity && entities[selectedEntity]?.fields.length > 0) {
      const firstField = entities[selectedEntity].fields[0].id;
      const firstFieldType = entities[selectedEntity].fields[0].type;
      const validOperator = operators.find(op => op.types.includes(firstFieldType));
      
      setFilters([
        ...filters,
        {
          id: Date.now().toString(),
          field: firstField,
          operator: validOperator?.id || 'equals',
          value: ''
        }
      ]);
    }
  };

  // Remove a filter
  const removeFilter = (filterId) => {
    setFilters(filters.filter(filter => filter.id !== filterId));
  };

  // Update filter field
  const updateFilterField = (filterId, field, value) => {
    setFilters(filters.map(filter => {
      if (filter.id === filterId) {
        // If changing field, reset operator to be compatible with new field type
        if (field === 'field') {
          const newFieldType = entities[selectedEntity].fields.find(f => f.id === value)?.type;
          const validOperator = operators.find(op => op.types.includes(newFieldType));
          return { ...filter, [field]: value, operator: validOperator?.id || 'equals', value: '' };
        }
        return { ...filter, [field]: value };
      }
      return filter;
    }));
  };

  // Generate preview data based on selections
  const generateReportPreview = (entity = selectedEntity, fields = selectedFields, reportFilters = filters) => {
    if (!entity || fields.length === 0) {
      toast.info('Select an entity and at least one field to preview');
      return;
    }

    setIsPreviewLoading(true);

    // Simulate API call to fetch data
    setTimeout(() => {
      try {
        // Generate mock data based on entity and fields
        let mockData = [];
        
        if (entity === 'contacts') {
          mockData = [
            { id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '(555) 123-4567', company: 'Acme Inc.', title: 'CEO', status: 'Customer', tags: ['VIP'], createdAt: '2023-01-15T10:30:00Z', lastActivity: '2023-09-10T14:25:00Z' },
            { id: '2', firstName: 'Emily', lastName: 'Johnson', email: 'emily@example.com', phone: '(555) 987-6543', company: 'XYZ Corp', title: 'Marketing Director', status: 'Lead', tags: ['Marketing', 'New'], createdAt: '2023-03-22T09:15:00Z', lastActivity: '2023-09-05T11:30:00Z' },
            { id: '3', firstName: 'Michael', lastName: 'Brown', email: 'michael@example.com', phone: '(555) 456-7890', company: 'Global Ltd', title: 'Sales Manager', status: 'Partner', tags: ['Sales'], createdAt: '2023-02-10T15:45:00Z', lastActivity: '2023-09-12T16:20:00Z' },
            { id: '4', firstName: 'Sarah', lastName: 'Davis', email: 'sarah@example.com', phone: '(555) 234-5678', company: 'Tech Solutions', title: 'CTO', status: 'Customer', tags: ['VIP', 'Technical'], createdAt: '2023-04-05T11:00:00Z', lastActivity: '2023-09-08T09:15:00Z' }
          ];
        } else if (entity === 'deals') {
          mockData = [
            { id: '1', name: 'Enterprise Software License', amount: 15000, stage: 'Proposal', priority: 'High', probability: 70, contactId: '1', companyId: '1', closeDate: '2023-10-15T00:00:00Z', createdAt: '2023-06-10T08:30:00Z', lastUpdated: '2023-09-05T14:20:00Z' },
            { id: '2', name: 'Consulting Services Package', amount: 8500, stage: 'Negotiation', priority: 'Medium', probability: 60, contactId: '2', companyId: '2', closeDate: '2023-09-30T00:00:00Z', createdAt: '2023-05-22T10:15:00Z', lastUpdated: '2023-09-10T11:45:00Z' },
            { id: '3', name: 'Hardware Upgrade', amount: 12000, stage: 'Qualification', priority: 'Medium', probability: 40, contactId: '3', companyId: '3', closeDate: '2023-11-15T00:00:00Z', createdAt: '2023-07-05T09:00:00Z', lastUpdated: '2023-09-01T16:30:00Z' },
            { id: '4', name: 'Annual Maintenance Contract', amount: 5000, stage: 'Closed Won', priority: 'Low', probability: 100, contactId: '4', companyId: '4', closeDate: '2023-08-30T00:00:00Z', createdAt: '2023-04-15T14:20:00Z', lastUpdated: '2023-08-30T10:00:00Z' }
          ];
        } else if (entity === 'tasks') {
          mockData = [
            { id: '1', title: 'Follow up with client', description: 'Call to discuss proposal details', status: 'Not Started', priority: 'High', assignedTo: 'John Doe', relatedTo: 'Deal #1', dueDate: '2023-09-20T00:00:00Z', completedAt: null, createdAt: '2023-09-10T09:00:00Z' },
            { id: '2', title: 'Prepare presentation', description: 'Create slides for client meeting', status: 'In Progress', priority: 'Medium', assignedTo: 'Emily Johnson', relatedTo: 'Deal #2', dueDate: '2023-09-18T00:00:00Z', completedAt: null, createdAt: '2023-09-05T11:30:00Z' },
            { id: '3', title: 'Send invoice', description: 'Generate and email invoice to client', status: 'Completed', priority: 'Medium', assignedTo: 'Sarah Davis', relatedTo: 'Deal #4', dueDate: '2023-09-10T00:00:00Z', completedAt: '2023-09-09T15:00:00Z', createdAt: '2023-09-01T10:15:00Z' },
            { id: '4', title: 'Schedule demo', description: 'Set up product demonstration', status: 'Not Started', priority: 'High', assignedTo: 'Michael Brown', relatedTo: 'Deal #3', dueDate: '2023-09-25T00:00:00Z', completedAt: null, createdAt: '2023-09-12T14:00:00Z' }
          ];
        }

        // Apply filters if any
        if (reportFilters && reportFilters.length > 0) {
          mockData = mockData.filter(item => {
            return reportFilters.every(filter => {
              const fieldValue = item[filter.field];
              const filterValue = filter.value;
              
              switch (filter.operator) {
                case 'equals':
                  return fieldValue === filterValue;
                case 'notEquals':
                  return fieldValue !== filterValue;
                case 'contains':
                  return typeof fieldValue === 'string' 
                    ? fieldValue.toLowerCase().includes(filterValue.toLowerCase())
                    : Array.isArray(fieldValue) && fieldValue.includes(filterValue);
                case 'notContains':
                  return typeof fieldValue === 'string' 
                    ? !fieldValue.toLowerCase().includes(filterValue.toLowerCase())
                    : Array.isArray(fieldValue) && !fieldValue.includes(filterValue);
                case 'greaterThan':
                  return fieldValue > filterValue;
                case 'lessThan':
                  return fieldValue < filterValue;
                case 'isNull':
                  return fieldValue === null || fieldValue === undefined || fieldValue === '';
                case 'isNotNull':
          const fetchEntityData = async () => {
            try {
              // In a real implementation, this would use the contactsService to get actual data
              // For this demo, we'll continue using sample data
              
              // If this was using real data, it would look something like:
              // const { ApperClient } = window.ApperSDK;
              // const apperClient = new ApperClient({
              //   apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              //   apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
              // });
              // const response = await apperClient.fetchRecords(entity, { fields, filters });
              // return response.data;
              
              // Generate mock data based on entity and fields
              if (entity === 'contacts') {
                return [
            });
          });
        }

        setPreviewData(mockData);
        setIsPreviewLoading(false);
        
        if (mockData.length === 0) {
          toast.info('No data matches your criteria');
        }
      } catch (error) {
        console.error('Error generating preview:', error);
        toast.error('Failed to generate preview');
        setIsPreviewLoading(false);
      }
    }, 1000);
  };

  // Validate the report configuration
  const validateReport = () => {
    const errors = {};
    
    if (!reportName.trim()) {
      errors.reportName = 'Report name is required';
    }
    
    if (!selectedEntity) {
      errors.selectedEntity = 'Please select an entity';
    }
    
    if (selectedFields.length === 0) {
      errors.selectedFields = 'Select at least one field';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle report saving
  const handleSaveReport = () => {
    if (!validateReport()) {
      toast.error('Please fix validation errors before saving');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const reportData = {
          Id: selectedReport?.id, // Include the ID if we're updating an existing report
        name: reportName,
        description: reportDescription,
        type: visualizationType === 'table' ? 'table' : 'chart',
        chartType: visualizationType,
        entity: selectedEntity,
        fields: selectedFields,
        filters: filters
      };
      
      onSave(reportData);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700">
      <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-surface-800 dark:text-white">
              {initialReport ? 'Edit Report' : 'Create New Report'}
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              Define your report criteria and visualize your data
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={onCancel}
              className="btn-outline"
              disabled={isLoading}
            >
              <XCircleIcon className="h-4 w-4 mr-1.5" />
              Cancel
            </button>
            
            <button 
              onClick={handleSaveReport}
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCwIcon className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-1.5" />
                  Save Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar with steps */}
        <div className="w-full md:w-64 lg:w-72 border-r border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Report Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name"
                className={`input ${validationErrors.reportName ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {validationErrors.reportName && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.reportName}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Description
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Brief description of this report"
                rows="3"
                className="input"
              ></textarea>
            </div>
            
            <div className="space-y-1 mt-6">
              <button
                onClick={() => setActiveStep('fields')}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeStep === 'fields'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                <LayersIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>1. Select Data</span>
              </button>
              
              <button
                onClick={() => setActiveStep('filters')}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeStep === 'filters'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                <FilterIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>2. Apply Filters</span>
              </button>
              
              <button
                onClick={() => setActiveStep('visualization')}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeStep === 'visualization'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                <BarChartIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>3. Visualize</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveStep('preview');
                  generateReportPreview();
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeStep === 'preview'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                }`}
              >
                <EyeIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>4. Preview</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto max-h-[calc(100vh-12rem)]">
          {activeStep === 'fields' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Select Data Source</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
                  Choose which entity you want to report on and select the fields to include
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    Entity <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedEntity}
                    onChange={handleEntityChange}
                    className={`select ${validationErrors.selectedEntity ? 'border-red-500 dark:border-red-500' : ''}`}
                  >
                    <option value="">Select an entity</option>
                    {Object.entries(entities).map(([id, entity]) => (
                      <option key={id} value={id}>{entity.name}</option>
                    ))}
                  </select>
                  {validationErrors.selectedEntity && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.selectedEntity}</p>
                  )}
                </div>
                
                {selectedEntity && (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Fields <span className="text-red-500">*</span>
                    </label>
                    <div className={`bg-surface-50 dark:bg-surface-700/30 rounded-lg border ${
                      validationErrors.selectedFields 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-surface-200 dark:border-surface-700'
                    } p-3 max-h-80 overflow-y-auto`}>
                      {entities[selectedEntity].fields.map(field => (
                        <div key={field.id} className="flex items-center py-2 border-b border-surface-200 dark:border-surface-700/50 last:border-b-0">
                          <input
                            type="checkbox"
                            id={`field-${field.id}`}
                            checked={selectedFields.includes(field.id)}
                            onChange={() => toggleFieldSelection(field.id)}
                            className="h-4 w-4 text-primary border-surface-300 dark:border-surface-600 rounded focus:ring-primary"
                          />
                          <label htmlFor={`field-${field.id}`} className="ml-3 block text-sm text-surface-700 dark:text-surface-300">
                            {field.name}
                            <span className="ml-1.5 text-xs text-surface-500 dark:text-surface-400">
                              ({field.type})
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {validationErrors.selectedFields && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.selectedFields}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeStep === 'filters' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Apply Filters</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
                  Add conditions to filter your report data (optional)
                </p>
                
                <button 
                  onClick={addFilter}
                  className="btn-outline mb-4"
                  disabled={!selectedEntity}
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Filter
                </button>
                
                {filters.length === 0 ? (
                  <div className="text-center py-8 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <FilterIcon className="h-12 w-12 mx-auto text-surface-400 mb-2" />
                    <p className="text-surface-500 dark:text-surface-400">
                      No filters applied. Your report will include all data.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filters.map(filter => (
                      <div key={filter.id} className="flex flex-wrap items-center gap-2 p-3 bg-surface-50 dark:bg-surface-700/30 rounded-lg border border-surface-200 dark:border-surface-700">
                        <div className="min-w-[150px] flex-grow">
                          <select
                            value={filter.field}
                            onChange={(e) => updateFilterField(filter.id, 'field', e.target.value)}
                            className="select py-1.5"
                          >
                            {entities[selectedEntity].fields.map(field => (
                              <option key={field.id} value={field.id}>{field.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="min-w-[150px] flex-grow">
                          <select
                            value={filter.operator}
                            onChange={(e) => updateFilterField(filter.id, 'operator', e.target.value)}
                            className="select py-1.5"
                          >
                            {operators
                              .filter(op => {
                                const fieldType = entities[selectedEntity].fields.find(f => f.id === filter.field)?.type;
                                return op.types.includes(fieldType);
                              })
                              .map(op => (
                                <option key={op.id} value={op.id}>{op.name}</option>
                              ))
                            }
                          </select>
                        </div>
                        
                        {filter.operator !== 'isNull' && filter.operator !== 'isNotNull' && (
                          <div className="min-w-[150px] flex-grow">
                            <input
                              type="text"
                              value={filter.value}
                              onChange={(e) => updateFilterField(filter.id, 'value', e.target.value)}
                              placeholder="Value"
                              className="input py-1.5"
                            />
                          </div>
                        )}
                        
                        <button
                          onClick={() => removeFilter(filter.id)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:text-surface-400 dark:hover:text-red-400 dark:hover:bg-surface-700"
                          aria-label="Remove filter"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeStep === 'visualization' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose Visualization</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
                  Select how you want to visualize your report data
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {visualizationTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setVisualizationType(type.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                        visualizationType === type.id
                          ? 'bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:border-primary-light dark:text-primary-light'
                          : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50'
                      }`}
                    >
                      <type.icon className="h-10 w-10 mb-2" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Preview Report</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">
                  Preview how your report will look with sample data
                </p>
                
                <button
                  onClick={() => generateReportPreview()}
                  className="btn-outline mb-4"
                >
                  <RefreshCwIcon className="h-4 w-4 mr-1.5" />
                  Refresh Preview
                </button>
                
                {isPreviewLoading ? (
                  <div className="flex justify-center items-center h-64 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex flex-col items-center">
                      <RefreshCwIcon className="h-10 w-10 text-primary animate-spin mb-4" />
                      <p className="text-surface-600 dark:text-surface-400">Loading preview...</p>
                    </div>
                  </div>
                ) : (!selectedEntity || selectedFields.length === 0) ? (
                  <div className="text-center py-12 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <EyeIcon className="h-12 w-12 mx-auto text-surface-400 mb-2" />
                    <p className="text-surface-700 dark:text-surface-300 font-medium mb-1">No preview available</p>
                    <p className="text-surface-500 dark:text-surface-400">
                      Select an entity and fields to generate a preview
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                    <ReportVisualization
                      data={previewData}
                      fields={selectedFields}
                      entity={selectedEntity}
                      visualizationType={visualizationType}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;