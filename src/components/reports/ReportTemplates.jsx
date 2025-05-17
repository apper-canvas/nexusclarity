import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

// Get icon components
const XCircleIcon = getIcon('XCircle');
const SearchIcon = getIcon('Search');
const FileTextIcon = getIcon('FileText');
const BarChartIcon = getIcon('BarChart');
const CheckIcon = getIcon('Check');
const InfoIcon = getIcon('Info');

const ReportTemplates = ({ templates, onSelect, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Filter templates by search term
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle template selection
  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      toast.success(`${selectedTemplate.name} template selected`);
    } else {
      toast.error('Please select a template');
    }
  };
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700">
      <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-surface-800 dark:text-white">Report Templates</h2>
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              Choose a pre-defined template to get started quickly
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button onClick={onCancel} className="btn-outline">
              <XCircleIcon className="h-4 w-4 mr-1.5" />
              Cancel
            </button>
            
            <button 
              onClick={handleSelect}
              className="btn-primary"
              disabled={!selectedTemplate}
            >
              <CheckIcon className="h-4 w-4 mr-1.5" />
              Use Template
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input py-2 pl-9 pr-4 w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-surface-400" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="text-center">
                <InfoIcon className="h-12 w-12 mx-auto text-surface-400 mb-3" />
                <p className="text-surface-700 dark:text-surface-300 font-medium">No templates found</p>
                <p className="text-surface-500 dark:text-surface-400">Try a different search term</p>
              </div>
            </div>
          ) : (
            filteredTemplates.map(template => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedTemplate(template)}
                className={`cursor-pointer card hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface-900' 
                    : ''
                }`}
              >
                <div className={`p-3 rounded-lg inline-flex items-center justify-center bg-${template.type === 'chart' ? 'purple' : 'blue'}-500/10 text-${template.type === 'chart' ? 'purple' : 'blue'}-500 mb-3`}>
                  {template.type === 'chart' ? <BarChartIcon className="h-6 w-6" /> : <FileTextIcon className="h-6 w-6" />}
                </div>
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{template.description}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportTemplates;