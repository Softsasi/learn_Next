'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ErrorRole = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Invalid Role Parameter
        </h1>
        <p className="text-gray-600 mb-6">
          The role you provided in the URL is not valid. Please use a valid role
          — either <span className="font-medium text-gray-800">student</span> or
          <span className="font-medium text-gray-800"> teacher</span>.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/signup?role=student')}
          >
            Continue as Student
          </Button>
          <Button onClick={() => router.push('/signup?role=teacher')}>
            Continue as Teacher
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorRole;
