import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Get icon components
const UserIcon = getIcon('Users');
const DollarSignIcon = getIcon('DollarSign');
const CheckSquareIcon = getIcon('CheckSquare');
const BarChartIcon = getIcon('BarChart');
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const BellIcon = getIcon('Bell');
const SettingsIcon = getIcon('Settings');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Stats data for the dashboard
  const stats = [
    { 
      id: 1, 
      title: 'Total Contacts', 
      value: 2456, 
      change: '+12%', 
      icon: UserIcon, 
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      id: 2, 
      title: 'Active Deals', 
      value: 189, 
      change: '+7.5%', 
      icon: DollarSignIcon, 
      color: 'bg-purple-500/10 text-purple-500'
    },
    { 
      id: 3, 
      title: 'Pending Tasks', 
      value: 45, 
      change: '-3%', 
      icon: CheckSquareIcon, 
      color: 'bg-amber-500/10 text-amber-500'
    },
    { 
      id: 4, 
      title: 'Revenue (MTD)', 
      value: '$89.5k', 
      change: '+22%', 
      icon: BarChartIcon, 
      color: 'bg-green-500/10 text-green-500'
    }
  ];

  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'contacts', name: 'Contacts', icon: 'Users' },
    { id: 'companies', name: 'Companies', icon: 'Building2' },
    { id: 'deals', name: 'Deals', icon: 'DollarSign' },
    { id: 'tasks', name: 'Tasks', icon: 'CheckSquare' },
    { id: 'calendar', name: 'Calendar', icon: 'Calendar' },
    { id: 'reports', name: 'Reports', icon: 'BarChart' },
    { id: 'settings', name: 'Settings', icon: 'Settings' }
  ];

  const createNewItem = () => {
    toast.success("New item created successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-100 dark:bg-surface-900">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="p-2 rounded-md lg:hidden"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <MenuIcon className="h-6 w-6 text-surface-600 dark:text-surface-300" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </span>
                <span className="text-xl font-bold text-surface-800 dark:text-white">NexusCRM</span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center flex-1 mx-8">
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Search contacts, deals, tasks..."
                  className="input py-1.5 pl-10 pr-4"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-surface-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700" aria-label="Notifications">
                <BellIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700" aria-label="Settings">
                <SettingsIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
              </button>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for mobile (overlay) */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 lg:hidden bg-surface-800/50 backdrop-blur-sm"
          onClick={toggleSidebar}
        ></motion.div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          initial={false}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 lg:hidden">
              <div className="flex items-center space-x-2">
                <span className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </span>
                <span className="text-xl font-bold text-surface-800 dark:text-white">NexusCRM</span>
              </div>
              <button
                className="p-2 rounded-md text-surface-500"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                {navItems.map((item) => {
                  const NavIcon = getIcon(item.icon);
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          activeTab === item.id
                            ? 'bg-primary/10 text-primary dark:bg-primary/20'
                            : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'
                        }`}
                      >
                        <NavIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="p-4 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={createNewItem}
                className="w-full btn-primary py-2.5 group"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                <span>Create New</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-1">Dashboard</h1>
                <p className="text-surface-500 dark:text-surface-400">Welcome back, John Doe! Here's what's happening today.</p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: stat.id * 0.1 }}
                    className="card hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">{stat.title}</p>
                        <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                        <div className="mt-1">
                          <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.change} from last month
                          </span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Main feature */}
              <MainFeature />
            </div>
          )}
          
          {activeTab !== 'dashboard' && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="p-6 bg-surface-200/50 dark:bg-surface-800/50 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 text-surface-400 dark:text-surface-500">
                  {getIcon(navItems.find(item => item.id === activeTab)?.icon || 'FileQuestion')({
                    size: 64,
                    strokeWidth: 1.5
                  })}
                </div>
                <h2 className="text-xl font-semibold mb-2">{navItems.find(item => item.id === activeTab)?.name || 'Unknown'} Module</h2>
                <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
                  This module is part of the demo and is not fully implemented in this MVP version.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;