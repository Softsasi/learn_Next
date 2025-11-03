'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';

const UnAuthorize = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Required
        </h2>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page. Please log in to
          continue.
        </p>

        <Link
          href="/signin"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </Link>

        <div className="mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorize;
