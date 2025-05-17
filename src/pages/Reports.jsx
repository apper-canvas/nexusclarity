import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import ReportBuilder from '../components/reports/ReportBuilder';
import ReportTemplates from '../components/reports/ReportTemplates';
import { reportTemplates } from '../data/reportData';

// Get icon components
const BarChartIcon = getIcon('BarChart');
const ChevronLeftIcon = getIcon('ChevronLeft');
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const TrashIcon = getIcon('Trash2');
const EditIcon = getIcon('Edit2');
const EyeIcon = getIcon('Eye');
const FileTextIcon = getIcon('FileText');
const DownloadIcon = getIcon('Download');
const RefreshCwIcon = getIcon('RefreshCw');

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Load saved reports from localStorage or use defaults
  useEffect(() => {
    const loadReports = () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        try {
          const savedReports = localStorage.getItem('reports');
          if (savedReports) {
            setReports(JSON.parse(savedReports));
          } else {
            // Use some default reports if none are saved
            const defaultReports = [
              {
                id: '1',
                name: 'Monthly Sales Pipeline',
                description: 'Overview of all deals by stage with forecast revenue',
                type: 'chart',
                chartType: 'bar',
                entity: 'deals',
                fields: ['stage', 'amount', 'closeDate'],
                filters: [{field: 'closeDate', operator: 'inTheLast', value: '30'}],
                createdAt: '2023-06-15T10:30:00Z',
                lastRun: '2023-09-20T08:45:00Z'
              },
              {
                id: '2',
                name: 'Contact Activity Summary',
                description: 'List of all contacts with recent activity',
                type: 'table',
                entity: 'contacts',
                fields: ['firstName', 'lastName', 'email', 'company', 'lastActivity'],
                filters: [{field: 'status', operator: 'equals', value: 'Customer'}],
                createdAt: '2023-05-10T14:20:00Z',
                lastRun: '2023-09-18T15:30:00Z'
              }
            ];
            setReports(defaultReports);
            localStorage.setItem('reports', JSON.stringify(defaultReports));
          }
        } catch (error) {
          console.error('Error loading reports:', error);
          toast.error('Failed to load reports');
          setReports([]);
        } finally {
          setIsLoading(false);
        }
      }, 800);
    };

    loadReports();
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && reports.length > 0) {
      localStorage.setItem('reports', JSON.stringify(reports));
    }
  }, [reports, isLoading]);

  // Open the report builder with a blank report
  const openNewReportBuilder = () => {
    setSelectedReport(null);
    setIsBuilderOpen(true);
    setIsTemplatesOpen(false);
  };

  // Open the report builder with an existing report
  const editReport = (report) => {
    setSelectedReport(report);
    setIsBuilderOpen(true);
    setIsTemplatesOpen(false);
  };

  // Open template selection
  const openTemplates = () => {
    setIsTemplatesOpen(true);
    setIsBuilderOpen(false);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    const newReport = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastRun: null
    };
    
    setSelectedReport(newReport);
    setIsTemplatesOpen(false);
    setIsBuilderOpen(true);
  };

  // Save a report (new or edited)
  const saveReport = (reportData) => {
    if (selectedReport) {
      // Update existing report
      const updatedReports = reports.map(report => 
        report.id === selectedReport.id ? { ...reportData, id: report.id } : report
      );
      setReports(updatedReports);
      toast.success('Report updated successfully!');
    } else {
      // Create new report
      const newReport = {
        ...reportData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastRun: null
      };
      setReports([...reports, newReport]);
      toast.success('Report created successfully!');
    }
    
    setIsBuilderOpen(false);
  };

  // Delete a report
  const deleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(report => report.id !== id));
      toast.success('Report deleted successfully!');
    }
  };

  // Run a report
  const runReport = (report) => {
    toast.info(`Running ${report.name}...`);
    
    setTimeout(() => {
      const updatedReports = reports.map(r => 
        r.id === report.id ? { ...r, lastRun: new Date().toISOString() } : r
      );
      setReports(updatedReports);
      toast.success('Report completed successfully!');
    }, 1200);
  };

  // Export a report
  const exportReport = (report) => {
    toast.info(`Exporting ${report.name}...`);
    setTimeout(() => {
      toast.success('Report exported successfully!');
    }, 800);
  };

  // Filter reports by search term
  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-100 dark:bg-surface-900">
      <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200">
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </span>
              <span className="text-xl font-bold text-surface-800 dark:text-white">NexusCRM</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isBuilderOpen ? (
          <ReportBuilder 
            initialReport={selectedReport}
            onSave={saveReport}
            onCancel={() => setIsBuilderOpen(false)}
          />
        ) : isTemplatesOpen ? (
          <ReportTemplates 
            templates={reportTemplates}
            onSelect={handleTemplateSelect}
            onCancel={() => setIsTemplatesOpen(false)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-1">Reports</h1>
                <p className="text-surface-500 dark:text-surface-400">Create, manage and view custom reports</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input py-2 pl-9 pr-4 w-full"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-surface-400" />
                  </div>
                </div>
                
                <button onClick={openTemplates} className="btn-secondary whitespace-nowrap">
                  <FileTextIcon className="h-4 w-4 mr-1.5" />
                  Use Template
                </button>
                
                <button onClick={openNewReportBuilder} className="btn-primary whitespace-nowrap">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Create Report
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                  <RefreshCwIcon className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-surface-600 dark:text-surface-400">Loading reports...</p>
                </div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white dark:bg-surface-800 rounded-xl shadow-card p-8 text-center">
                <BarChartIcon className="h-16 w-16 text-surface-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Reports Found</h2>
                <p className="text-surface-500 dark:text-surface-400 max-w-md mb-6">
                  {searchTerm 
                    ? 'No reports match your search criteria. Try a different search term or create a new report.'
                    : 'You haven\'t created any reports yet. Create your first report to get started.'}
                </p>
                <div className="flex gap-3">
                  <button onClick={openTemplates} className="btn-secondary">
                    <FileTextIcon className="h-4 w-4 mr-1.5" />
                    Use Template
                  </button>
                  <button onClick={openNewReportBuilder} className="btn-primary">
                    <PlusIcon className="h-4 w-4 mr-1.5" />
                    Create Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.map(report => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="card hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{report.name}</h3>
                        <p className="text-surface-500 dark:text-surface-400 text-sm">{report.description}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-${report.type === 'chart' ? 'purple' : 'blue'}-500/10 text-${report.type === 'chart' ? 'purple' : 'blue'}-500`}>
                        {report.type === 'chart' ? <BarChartIcon className="h-5 w-5" /> : <FileTextIcon className="h-5 w-5" />}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="badge-info">
                        {report.entity.charAt(0).toUpperCase() + report.entity.slice(1)}
                      </span>
                      {report.lastRun && (
                        <span className="badge-neutral text-xs">
                          Last run: {new Date(report.lastRun).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-surface-200 dark:border-surface-700">
                      <div className="text-xs text-surface-500 dark:text-surface-400">
                        Created {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => runReport(report)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-primary hover:bg-surface-200 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700"
                          aria-label="Run Report"
                          title="Run Report"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => exportReport(report)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-primary hover:bg-surface-200 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700"
                          aria-label="Export Report"
                          title="Export Report"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => editReport(report)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-primary hover:bg-surface-200 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700"
                          aria-label="Edit Report"
                          title="Edit Report"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:text-surface-400 dark:hover:text-red-400 dark:hover:bg-surface-700"
                          aria-label="Delete Report"
                          title="Delete Report"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;