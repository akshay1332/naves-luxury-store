import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found - CustomPrint"
        description="The page you're looking for doesn't exist."
      />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 text-center">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>
            Return to Home
          </Button>
        </Link>
      </div>
    </>
  );
} 