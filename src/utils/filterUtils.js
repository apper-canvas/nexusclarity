import { format, parseISO, isWithinInterval, subDays } from 'date-fns';

/**
 * Formats a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - format string for date-fns
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM d, yyyy') => {
  try {
    if (!dateString) return '';
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Filters data by text search across multiple fields
 * @param {Array} data - Array of objects to filter
 * @param {string} searchTerm - Search term to filter by
 * @param {Array} fields - Object fields to search in
 * @returns {Array} Filtered data
 */
export const filterByText = (data, searchTerm, fields) => {
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter(item => 
    fields.some(field => {
      // Handle nested fields with dot notation
      if (field.includes('.')) {
        const props = field.split('.');
        let value = item;
        for (const prop of props) {
          value = value?.[prop];
        }
        return String(value || '').toLowerCase().includes(term);
      }
      
      return String(item[field] || '').toLowerCase().includes(term);
    })
  );
};

/**
 * Filters data by date range
 * @param {Array} data - Array of objects to filter
 * @param {string} dateField - Field containing the date
 * @param {string} dateRange - Range identifier (e.g., 'last30days')
 * @returns {Array} Filtered data
 */
export const filterByDateRange = (data, dateField, dateRange) => {
  if (!dateRange || dateRange === 'all') return data;
  
  const now = new Date();
  
  const dateRanges = {
    'last7days': subDays(now, 7),
    'last30days': subDays(now, 30),
    'last90days': subDays(now, 90),
  };
  
  const startDate = dateRanges[dateRange];
  
  return data.filter(item => 
    isWithinInterval(parseISO(item[dateField]), { start: startDate, end: now }));
};