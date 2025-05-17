// Pre-defined report templates
export const reportTemplates = [
  {
    id: 'template-sales-pipeline',
    name: 'Sales Pipeline Report',
    description: 'Overview of all deals grouped by stage with total value',
    type: 'chart',
    chartType: 'bar',
    entity: 'deals',
    fields: ['stage', 'amount'],
    filters: []
  },
  {
    id: 'template-contact-status',
    name: 'Contact Status Report',
    description: 'Distribution of contacts by status (lead, customer, partner)',
    type: 'chart',
    chartType: 'pie',
    entity: 'contacts',
    fields: ['status'],
    filters: []
  },
  {
    id: 'template-task-priority',
    name: 'Task Priority Report',
    description: 'Tasks grouped by priority level',
    type: 'chart',
    chartType: 'bar',
    entity: 'tasks',
    fields: ['priority', 'status'],
    filters: [{field: 'status', operator: 'notEquals', value: 'Completed'}]
  },
  {
    id: 'template-deals-month',
    name: 'Monthly Deal Forecast',
    description: 'Expected deal closures by month with probability-weighted value',
    type: 'chart',
    chartType: 'line',
    entity: 'deals',
    fields: ['closeDate', 'amount', 'probability'],
    filters: [{field: 'stage', operator: 'notEquals', value: 'Closed Lost'}]
  },
  {
    id: 'template-task-overdue',
    name: 'Overdue Tasks',
    description: 'List of all tasks that are past their due date',
    type: 'table',
    entity: 'tasks',
    fields: ['title', 'dueDate', 'priority', 'assignedTo', 'relatedTo'],
    filters: [
      {field: 'status', operator: 'notEquals', value: 'Completed'},
      {field: 'dueDate', operator: 'lessThan', value: new Date().toISOString()}
    ]
  },
  {
    id: 'template-active-contacts',
    name: 'Recent Contact Activity',
    description: 'Contacts with recent activity, sorted by last interaction date',
    type: 'table',
    entity: 'contacts',
    fields: ['firstName', 'lastName', 'email', 'company', 'lastActivity', 'status'],
    filters: [{field: 'lastActivity', operator: 'inTheLast', value: '30'}]
  },
  {
    id: 'template-high-value-deals',
    name: 'High Value Deals',
    description: 'All deals with value above $10,000',
    type: 'table',
    entity: 'deals',
    fields: ['name', 'amount', 'stage', 'probability', 'closeDate'],
    filters: [{field: 'amount', operator: 'greaterThan', value: '10000'}]
  },
  {
    id: 'template-won-deals',
    name: 'Closed Won Deals',
    description: 'Analysis of successfully closed deals',
    type: 'chart',
    chartType: 'bar',
    entity: 'deals',
    fields: ['closeDate', 'amount'],
    filters: [{field: 'stage', operator: 'equals', value: 'Closed Won'}]
  },
  {
    id: 'template-companies-contacts',
    name: 'Companies with Contacts',
    description: 'List of companies and their associated contacts',
    type: 'table',
    entity: 'contacts',
    fields: ['company', 'firstName', 'lastName', 'title', 'email', 'phone'],
    filters: []
  }
];

// Sample data structure for a saved report
export const sampleReportStructure = {
  id: '123',
  name: 'Monthly Sales Pipeline',
  description: 'Overview of all deals by stage with forecast revenue',
  type: 'chart', // or 'table'
  chartType: 'bar', // 'bar', 'line', 'pie', 'area', etc. (if type is 'chart')
  entity: 'deals', // 'contacts', 'deals', 'tasks', etc.
  fields: ['stage', 'amount', 'closeDate'], // array of field ids to include
  filters: [
    {
      field: 'closeDate',
      operator: 'inTheLast',
      value: '30' // days
    }
  ],
  createdAt: '2023-06-15T10:30:00Z',
  lastRun: '2023-09-20T08:45:00Z'
};