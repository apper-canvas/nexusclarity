import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { reportService } from '../services/reportService';
import ReportBuilder from '../components/reports/ReportBuilder';
import ReportVisualization from '../components/reports/ReportVisualization';

// Get icon components
const PlusIcon = getIcon('Plus');
const RefreshCwIcon = getIcon('RefreshCw');
const ClipboardIcon = getIcon('Clipboard');
const TrashIcon = getIcon('Trash2');
const EditIcon = getIcon('Edit2');
const EyeIcon = getIcon('Eye');
const ArrowLeftIcon = getIcon('ArrowLeft');
const BarChartIcon = getIcon('BarChart');
const TableIcon = getIcon('Table');
const PieChartIcon = getIcon('PieChart');
const LineChartIcon = getIcon('LineChart');
const TrendingUpIcon = getIcon('TrendingUp');
const AlertCircleIcon = getIcon('AlertCircle');

const getChartIcon = (type) => {
  switch (type) {
    case 'bar': return BarChartIcon;
    case 'line': return LineChartIcon;
    case 'pie': return PieChartIcon;
    case 'area': return TrendingUpIcon;
    case 'table':
    default: return TableIcon;
  }
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Load reports on component mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const data = await reportService.getReports();
        setReports(data);
      } catch (error) {
        toast.error('Failed to load reports');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  // Open report builder
  const openReportBuilder = () => {
    setIsEditing(false);
    setSelectedReport(null);
    setIsBuilderOpen(true);
  };

  // Edit existing report
  const editReport = (report) => {
    setIsEditing(true);
    setSelectedReport(report);
    setIsBuilderOpen(true);
  };

  // Close report builder
  const closeReportBuilder = () => {
    setIsBuilderOpen(false);
    setSelectedReport(null);
  };

  // View a report
  const viewReport = async (report) => {
    try {
      setIsReportLoading(true);
      setActiveReport(report);
      
      // In a real application, this would fetch actual data based on the report criteria
      // For now, we'll generate sample data
      
      // Create sample data based on the entity type
      let sampleData = [];
      
      if (report.entity === 'contacts') {
        // Fetch real contact data but limit to the fields specified in the report
        const contacts = await reportService.getContacts();
        sampleData = contacts.map(contact => {
          const filteredContact = {};
          report.fields.forEach(field => {
            filteredContact[field] = contact[field];
          });
          return filteredContact;
        });
      } else {
        // Generate mock data for other entity types
        for (let i = 0; i < 5; i++) {
          const item = {};
          report.fields.forEach(field => {
            if (field.includes('Date') || field === 'createdAt' || field === 'dueDate') {
              item[field] = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
            } else if (field === 'amount' || field === 'probability') {
              item[field] = Math.floor(Math.random() * 10000);
            } else {
              item[field] = `Sample ${field} ${i+1}`;
            }
          });
          sampleData.push(item);
        }
      }
      
      setReportData(sampleData);
      setIsReportLoading(false);
    } catch (error) {
      toast.error('Failed to load report data');
      console.error(error);
      setIsReportLoading(false);
    }
  };

  // Close report view
  const closeReportView = () => {
    setActiveReport(null);
    setReportData([]);
  };

  // Save report
  const saveReport = async (reportData) => {
    try {
      if (isEditing && selectedReport) {
        // Update existing report
        const updatedReport = await reportService.updateReport(selectedReport.id, reportData);
        setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
        toast.success('Report updated successfully!');
      } else {
        // Create new report
        const newReport = await reportService.createReport(reportData);
        setReports([...reports, newReport]);
        toast.success('Report created successfully!');
      }
      setIsBuilderOpen(false);
      setSelectedReport(null);
    } catch (error) {
      toast.error('Failed to save report');
      console.error(error);
    }
  };

  // Delete report
  const deleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportService.deleteReport(id);
        setReports(reports.filter(r => r.id !== id));
        toast.success('Report deleted successfully!');
        
        if (activeReport && activeReport.id === id) {
          closeReportView();
        }
      } catch (error) {
        toast.error('Failed to delete report');
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {isBuilderOpen ? (
        <ReportBuilder
          initialReport={selectedReport}
          onSave={saveReport}
          onCancel={closeReportBuilder}
        />
      ) : activeReport ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button onClick={closeReportView} className="btn-outline">
              <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
              Back to Reports
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-surface-800 dark:text-white">{activeReport.name}</h1>
              {activeReport.description && (
                <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{activeReport.description}</p>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700">
            {isReportLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCwIcon className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <ReportVisualization
                data={reportData}
                fields={activeReport.fields}
                entity={activeReport.entity}
                visualizationType={activeReport.chartType}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-surface-800 dark:text-white">Reports</h1>
              <p className="text-surface-500 dark:text-surface-400 text-sm">
                Create and view custom reports for your data
              </p>
            </div>
            
            <button
              onClick={openReportBuilder}
              className="btn-primary whitespace-nowrap"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Create Report
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl shadow-card">
              <RefreshCwIcon className="w-8 h-8 text-primary animate-spin mb-3 mx-auto" />
              <p className="text-surface-600 dark:text-surface-400">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl shadow-card">
              <ClipboardIcon className="w-12 h-12 text-surface-400 mb-3 mx-auto" />
              <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-1">No reports yet</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">Create your first report to get started</p>
              <button
                onClick={openReportBuilder}
                className="btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Create Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map(report => {
                const ChartIcon = getChartIcon(report.chartType);
                return (
                  <div
                    key={report.id}
                    className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700 flex flex-col"
                  >
                    <div className="p-5 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                          <ChartIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-surface-800 dark:text-white">{report.name}</h3>
                          <p className="text-xs text-surface-500 dark:text-surface-400">
                            {report.entity && `${report.entity.charAt(0).toUpperCase() + report.entity.slice(1)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-grow">
                      <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2 mb-4">
                        {report.description || 'No description provided'}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Type:</span>
                          <span className="text-surface-800 dark:text-surface-200 font-medium">
                            {report.chartType.charAt(0).toUpperCase() + report.chartType.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-surface-500 dark:text-surface-400">Fields:</span>
                          <span className="text-surface-800 dark:text-surface-200 font-medium">
                            {Array.isArray(report.fields) ? report.fields.length : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-surface-50 dark:bg-surface-700/30 flex justify-between">
                      <button
                        onClick={() => viewReport(report)}
                        className="btn-outline py-1.5 px-3 text-sm"
                      >
                        <EyeIcon className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editReport(report)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-primary hover:bg-surface-200 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700"
                          aria-label="Edit"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-1.5 rounded-md text-surface-500 hover:text-red-500 hover:bg-surface-200 dark:text-surface-400 dark:hover:text-red-400 dark:hover:bg-surface-700"
                          aria-label="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;