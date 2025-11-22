import { Input } from '@/components/ui/input';
import React from 'react';

interface ProfileFormFieldProps extends React.ComponentProps<typeof Input> {
  id: string;
  label: string;
}

export const ProfileFormField = React.forwardRef<
  HTMLInputElement,
  ProfileFormFieldProps
>(({ id, label, className, readOnly, ...props }, ref) => {
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 block">
        {label}
        {readOnly && <span className="text-gray-400 font-normal ml-1">(Read-only)</span>}
      </label>
      <Input
        id={id}
        ref={ref}
        readOnly={readOnly}
        className={`h-10 text-base rounded-lg border transition-all duration-200 ${
          readOnly
            ? 'bg-gray-50 cursor-not-allowed border-gray-200 text-gray-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-gray-400'
        } ${className || ''}`}
        {...props}
      />
    </div>
  );
});

ProfileFormField.displayName = 'ProfileFormField';

interface ProfileTextAreaFieldProps extends React.ComponentProps<'textarea'> {
  id: string;
  label: string;
}

export const ProfileTextAreaField = React.forwardRef<
  HTMLTextAreaElement,
  ProfileTextAreaFieldProps
>(({ id, label, className, readOnly, ...props }, ref) => {
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 block">
        {label}
        {readOnly && <span className="text-gray-400 font-normal ml-1">(Read-only)</span>}
      </label>
      <textarea
        id={id}
        ref={ref}
        readOnly={readOnly}
        rows={4}
        className={`flex min-h-24 w-full rounded-lg border bg-white px-4 py-3 text-sm placeholder:text-gray-400 transition-all duration-200 ${
          readOnly
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-500'
            : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 hover:border-gray-400'
        } resize-none ${className || ''}`}
        {...props}
      />
    </div>
  );
});

ProfileTextAreaField.displayName = 'ProfileTextAreaField';
