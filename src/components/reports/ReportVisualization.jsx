import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getIcon } from '../../utils/iconUtils';

// Get icon components
const AlertCircleIcon = getIcon('AlertCircle');

const ReportVisualization = ({ data, fields, entity, visualizationType }) => {
  const [chartConfig, setChartConfig] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  // Get field name from entity definition
  const getFieldName = (fieldId) => {
    const entityData = {
      contacts: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
        title: 'Job Title',
        status: 'Status',
        tags: 'Tags',
        createdAt: 'Created Date',
        lastActivity: 'Last Activity Date'
      },
      deals: {
        name: 'Deal Name',
        amount: 'Amount',
        stage: 'Stage',
        priority: 'Priority',
        probability: 'Probability (%)',
        contactId: 'Contact',
        companyId: 'Company',
        closeDate: 'Expected Close Date',
        createdAt: 'Created Date',
        lastUpdated: 'Last Updated'
      },
      tasks: {
        title: 'Task Title',
        description: 'Description',
        status: 'Status',
        priority: 'Priority',
        assignedTo: 'Assigned To',
        relatedTo: 'Related To',
        dueDate: 'Due Date',
        completedAt: 'Completed Date',
        createdAt: 'Created Date'
      }
    };
    
    return entityData[entity]?.[fieldId] || fieldId;
  };

  // Format field value for display
  const formatValue = (value, fieldId) => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (typeof value === 'string' && (fieldId.includes('date') || fieldId.includes('Date'))) {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return value.toString();
  };

  // Prepare chart data when props change
  useEffect(() => {
    if (!data || data.length === 0 || !fields || fields.length === 0) {
      setChartData(null);
      return;
    }
    
    if (visualizationType === 'table') {
      // Table doesn't need special processing
      return;
    }
    
    try {
      // For charts, we need at least one categorical and one numerical field
      const firstField = fields[0];
      const secondField = fields.length > 1 ? fields[1] : null;
      
      if (!secondField) {
        // If only one field, just count occurrences
        const counts = {};
        data.forEach(item => {
          const value = formatValue(item[firstField], firstField);
          counts[value] = (counts[value] || 0) + 1;
        });
        
        const series = [{ 
          name: 'Count',
          data: Object.values(counts)
        }];
        
        const categories = Object.keys(counts);
        
        // Set chart configuration
        let config = {
          options: {
            chart: {
              type: visualizationType === 'pie' ? 'pie' : visualizationType,
              toolbar: {
                show: true
              },
              fontFamily: 'Inter, ui-sans-serif, system-ui',
            },
            theme: {
              mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
            },
            xaxis: {
              categories: categories
            },
            title: {
              text: `${getFieldName(firstField)} Distribution`,
              align: 'center',
              style: {
                fontSize: '16px',
                fontWeight: 600
              }
            },
            colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4']
          }
        };
        
        if (visualizationType === 'pie') {
          config.series = Object.values(counts);
          config.options.labels = categories;
        } else {
          config.series = series;
        }
        
        setChartConfig(config);
      } else {
        // If two fields, use first as category and second as value (if numeric)
        // Implement logic for handling different chart types with two fields
        // This is a basic implementation that can be expanded
        setChartConfig({
          options: {
            chart: {
              type: visualizationType,
              toolbar: {
                show: true
              },
              fontFamily: 'Inter, ui-sans-serif, system-ui',
            },
            xaxis: {
              categories: data.map(item => formatValue(item[firstField], firstField))
            },
            title: {
              text: `${getFieldName(firstField)} vs ${getFieldName(secondField)}`,
              align: 'center'
            }
          },
          series: [{
            name: getFieldName(secondField),
            data: data.map(item => {
              const val = item[secondField];
              return typeof val === 'number' ? val : 1;
            })
          }]
        });
      }
    } catch (error) {
      console.error('Error preparing chart data:', error);
      setChartData(null);
    }
  }, [data, fields, entity, visualizationType]);

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-700 dark:text-surface-300 font-medium">No data available</p>
          <p className="text-surface-500 dark:text-surface-400">Adjust your filters to see results</p>
        </div>
      </div>
    );
  }

  if (visualizationType === 'table') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-100 dark:bg-surface-700/50">
              {fields.map(field => (
                <th key={field} className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  {getFieldName(field)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                {fields.map(field => (
                  <td key={`${i}-${field}`} className="px-4 py-4 whitespace-nowrap text-surface-700 dark:text-surface-300">
                    {formatValue(row[field], field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!chartConfig) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircleIcon className="h-12 w-12 mx-auto text-surface-400 mb-3" />
          <p className="text-surface-700 dark:text-surface-300 font-medium">Cannot generate chart</p>
          <p className="text-surface-500 dark:text-surface-400">Select appropriate fields for visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Chart
        options={chartConfig.options}
        series={chartConfig.series}
        type={visualizationType}
        height={350}
      />
    </div>
  );
};

export default ReportVisualization;