import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import { reportService } from '../../services/reportService';
import ReportTemplates from './ReportTemplates';
import ReportVisualization from './ReportVisualization';

// Get icon components
const SaveIcon = getIcon('Save');
const SettingsIcon = getIcon('Settings');
const DatabaseIcon = getIcon('Database');
const LayoutIcon = getIcon('Layout');
const EyeIcon = getIcon('Eye');
const FilterIcon = getIcon('Filter');
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash');
const TemplateIcon = getIcon('FileText');

const ReportBuilder = ({ reportId, onSave, onCancel }) => {
  // State for managing the report configuration
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState('chart');
  const [chartType, setChartType] = useState('bar');
  const [selectedEntity, setSelectedEntity] = useState('contacts');
  const [selectedFields, setSelectedFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Entity field options for available fields selection
  const entityFields = {
    contacts: [
      { id: 'firstName', label: 'First Name', type: 'text' },
      { id: 'lastName', label: 'Last Name', type: 'text' },
      { id: 'email', label: 'Email', type: 'email' },
      { id: 'phone', label: 'Phone', type: 'phone' },
      { id: 'company', label: 'Company', type: 'text' },
      { id: 'title', label: 'Job Title', type: 'text' },
      { id: 'status', label: 'Status', type: 'picklist' }
    ],
    deals: [
      { id: 'name', label: 'Name', type: 'text' },
      { id: 'amount', label: 'Amount', type: 'currency' },
      { id: 'stage', label: 'Stage', type: 'picklist' },
      { id: 'probability', label: 'Probability', type: 'number' }
    ],
    tasks: [
      { id: 'title', label: 'Title', type: 'text' },
      { id: 'status', label: 'Status', type: 'picklist' },
      { id: 'priority', label: 'Priority', type: 'picklist' },
      { id: 'dueDate', label: 'Due Date', type: 'date' }
    ]
  };
  
  // Filter operator options
  const filterOperators = [
    { id: 'equals', label: 'Equals' },
    { id: 'notEquals', label: 'Does Not Equal' },
    { id: 'contains', label: 'Contains' },
    { id: 'notContains', label: 'Does Not Contain' },
    { id: 'greaterThan', label: 'Greater Than' },
    { id: 'lessThan', label: 'Less Than' }
  ];
  
  // Mock report templates
  const reportTemplates = [
    {
      id: 1,
      name: 'Contact Status Distribution',
      description: 'Shows the distribution of contacts by status',
      type: 'chart',
      chartType: 'pie',
      entity: 'contacts',
      fields: ['status'],
      filters: []
    },
    {
      id: 2,
      name: 'Contacts by Company',
      description: 'Lists all contacts grouped by company',
      type: 'table',
      entity: 'contacts',
      fields: ['firstName', 'lastName', 'email', 'company'],
      filters: []
    },
    {
      id: 3,
      name: 'Task Priority Analysis',
      description: 'Analyzes tasks by priority level',
      type: 'chart',
      chartType: 'bar',
      entity: 'tasks',
      fields: ['priority'],
      filters: []
    }
  ];
  
  // Mock data for preview
  const mockData = {
    contacts: [
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-1234', company: 'ABC Corp', title: 'CEO', status: 'Customer' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '555-5678', company: 'XYZ Inc', title: 'CTO', status: 'Lead' },
      { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '555-9012', company: 'ABC Corp', title: 'Developer', status: 'Customer' },
      { firstName: 'Alice', lastName: 'Williams', email: 'alice@example.com', phone: '555-3456', company: '123 LLC', title: 'Designer', status: 'Partner' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', phone: '555-7890', company: 'XYZ Inc', title: 'Manager', status: 'Lead' }
    ],
    deals: [
      { name: 'Big Deal', amount: 10000, stage: 'Proposal', probability: 50 },
      { name: 'Medium Deal', amount: 5000, stage: 'Negotiation', probability: 75 },
      { name: 'Small Deal', amount: 1000, stage: 'Closed Won', probability: 100 }
    ],
    tasks: [
      { title: 'Follow up call', status: 'Pending', priority: 'High', dueDate: '2023-10-15' },
      { title: 'Send proposal', status: 'Completed', priority: 'Medium', dueDate: '2023-10-10' },
      { title: 'Schedule meeting', status: 'Pending', priority: 'Low', dueDate: '2023-10-20' }
    ]
  };
  
  // Load existing report if editing
  useEffect(() => {
    if (reportId) {
      setLoading(true);
      reportService.getReportById(reportId)
        .then(report => {
          if (report) {
            setReportName(report.Name || '');
            setReportDescription(report.description || '');
            setReportType(report.type || 'chart');
            setChartType(report.chartType || 'bar');
            setSelectedEntity(report.entity || 'contacts');
            setSelectedFields(report.fields ? report.fields.split(',') : []);
            setFilters(report.filters ? JSON.parse(report.filters) : []);
          }
        })
        .catch(error => {
          console.error('Error loading report:', error);
          toast.error('Failed to load the report');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [reportId]);
  
  // Handle applying a template
  const handleTemplateSelect = (template) => {
    setReportName(template.name);
    setReportDescription(template.description);
    setReportType(template.type || 'chart');
    setChartType(template.chartType || 'bar');
    setSelectedEntity(template.entity || 'contacts');
    setSelectedFields(template.fields || []);
    setFilters(template.filters || []);
    setShowTemplates(false);
    
    toast.success(`Applied template: ${template.name}`);
  };
  
  // Handle adding a new filter
  const handleAddFilter = () => {
    setFilters([...filters, { field: entityFields[selectedEntity][0]?.id || '', operator: 'equals', value: '' }]);
  };
  
  // Handle removing a filter
  const handleRemoveFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };
  
  // Handle updating a filter
  const handleFilterChange = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };
  
  // Handle field selection
  const handleFieldToggle = (fieldId) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };
  
  // Handle saving the report
  const handleSave = async () => {
    if (!reportName.trim()) {
      toast.error('Report name is required');
      return;
    }
    
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field');
      return;
    }
    
    setLoading(true);
    
    const reportData = {
      Name: reportName,
      description: reportDescription,
      type: reportType,
      chartType: chartType,
      entity: selectedEntity,
      fields: selectedFields.join(','),
      filters: JSON.stringify(filters)
    };
    
    try {
      if (reportId) {
        await reportService.updateReport(reportId, {
          name: reportName,
          ...reportData
        });
        toast.success('Report updated successfully');
      } else {
        await reportService.createReport(reportData);
        toast.success('Report created successfully');
      }
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to save the report');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate preview data
  const generatePreviewData = () => {
    // In a real implementation, this would apply filters to the data
    // For now, just return the mock data for the selected entity
    setReportData(mockData[selectedEntity] || []);
    setPreviewMode(true);
    toast.info('Preview data loaded');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render the template selector if showTemplates is true
  if (showTemplates) {
    return (
      <ReportTemplates 
        templates={reportTemplates} 
        onSelect={handleTemplateSelect} 
        onCancel={() => setShowTemplates(false)}
      />
    );
  }
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-surface-800 dark:text-white">
              {reportId ? 'Edit Report' : 'Create New Report'}
            </h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {reportId ? 'Modify your existing report' : 'Configure your report settings'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowTemplates(true)} 
              className="btn-outline"
            >
              <TemplateIcon className="h-4 w-4 mr-1.5" />
              Use Template
            </button>
            <button 
              onClick={onCancel} 
              className="btn-outline"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="btn-primary"
              disabled={loading}
            >
              <SaveIcon className="h-4 w-4 mr-1.5" />
              Save Report
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="card">
            <div className="card-header">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <h3 className="card-title">Basic Information</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="reportName" className="form-label">Report Name</label>
                <input
                  id="reportName"
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="input"
                  placeholder="Enter report name"
                />
              </div>
              
              <div>
                <label htmlFor="reportDescription" className="form-label">Description</label>
                <textarea
                  id="reportDescription"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="input"
                  rows="3"
                  placeholder="Enter report description"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Data Source */}
          <div className="card">
            <div className="card-header">
              <DatabaseIcon className="h-5 w-5 text-primary" />
              <h3 className="card-title">Data Source</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="entity" className="form-label">Entity</label>
                <select
                  id="entity"
                  value={selectedEntity}
                  onChange={(e) => {
                    setSelectedEntity(e.target.value);
                    setSelectedFields([]); // Reset fields when entity changes
                  }}
                  className="input"
                >
                  <option value="contacts">Contacts</option>
                  <option value="deals">Deals</option>
                  <option value="tasks">Tasks</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Fields</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-surface-200 dark:border-surface-700 rounded-md p-2">
                  {entityFields[selectedEntity]?.map(field => (
                    <div key={field.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`field-${field.id}`}
                        checked={selectedFields.includes(field.id)}
                        onChange={() => handleFieldToggle(field.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-surface-300 rounded"
                      />
                      <label htmlFor={`field-${field.id}`} className="ml-2 block text-sm text-surface-700 dark:text-surface-300">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Visualization Settings */}
          <div className="card">
            <div className="card-header">
              <LayoutIcon className="h-5 w-5 text-primary" />
              <h3 className="card-title">Visualization</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="reportType" className="form-label">Report Type</label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="input"
                >
                  <option value="table">Table</option>
                  <option value="chart">Chart</option>
                </select>
              </div>
              
              {reportType === 'chart' && (
                <div>
                  <label htmlFor="chartType" className="form-label">Chart Type</label>
                  <select
                    id="chartType"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="input"
                  >
                    <option value="bar">Bar</option>
                    <option value="line">Line</option>
                    <option value="pie">Pie</option>
                    <option value="area">Area</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Preview and Filters Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="card">
            <div className="card-header">
              <FilterIcon className="h-5 w-5 text-primary" />
              <h3 className="card-title">Filters</h3>
            </div>
            <div className="card-body">
              {filters.length === 0 ? (
                <p className="text-surface-500 dark:text-surface-400 text-sm mb-4">No filters defined yet.</p>
              ) : (
                <div className="space-y-4 mb-4">
                  {filters.map((filter, index) => (
                    <div key={index} className="flex flex-wrap items-center gap-2">
                      <select
                        value={filter.field}
                        onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
                        className="input flex-1 min-w-[120px]"
                      >
                        {entityFields[selectedEntity]?.map(field => (
                          <option key={field.id} value={field.id}>{field.label}</option>
                        ))}
                      </select>
                      
                      <select
                        value={filter.operator}
                        onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                        className="input flex-1 min-w-[120px]"
                      >
                        {filterOperators.map(op => (
                          <option key={op.id} value={op.id}>{op.label}</option>
                        ))}
                      </select>
                      
                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                        className="input flex-1 min-w-[120px]"
                        placeholder="Value"
                      />
                      
                      <button
                        onClick={() => handleRemoveFilter(index)}
                        className="btn-icon text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleAddFilter}
                className="btn-outline"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add Filter
              </button>
            </div>
          </div>
          
          {/* Preview */}
          <div className="card">
            <div className="card-header">
              <EyeIcon className="h-5 w-5 text-primary" />
              <h3 className="card-title">Preview</h3>
            </div>
            <div className="card-body">
              {!previewMode ? (
                <div className="flex justify-center items-center h-64">
                  <button
                    onClick={generatePreviewData}
                    className="btn-primary"
                    disabled={selectedFields.length === 0}
                  >
                    <EyeIcon className="h-4 w-4 mr-1.5" />
                    Generate Preview
                  </button>
                </div>
              ) : (
                <ReportVisualization
                  data={reportData}
                  fields={selectedFields}
                  entity={selectedEntity}
                  visualizationType={reportType === 'chart' ? chartType : 'table'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;