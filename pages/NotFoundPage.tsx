import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto w-full min-h-[60vh] flex items-center">
      <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-10 md:p-14 w-full text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">404</p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
          The page you requested does not exist. Use the navigation to continue browsing the library.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 text-sm font-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Back to Browse
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
