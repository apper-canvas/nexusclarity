import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const FileSearchIcon = getIcon('FileSearch');
const ArrowLeftIcon = getIcon('ArrowLeft');

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-100 dark:bg-surface-900"
    >
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mx-auto w-20 h-20 mb-6 text-primary opacity-70"
        >
          <FileSearchIcon size={80} strokeWidth={1.5} />
        </motion.div>
        
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-2 text-surface-800 dark:text-white"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold mb-4 text-surface-700 dark:text-surface-200"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-surface-600 dark:text-surface-300 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/" className="inline-flex items-center space-x-2 btn-primary">
            <ArrowLeftIcon size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;