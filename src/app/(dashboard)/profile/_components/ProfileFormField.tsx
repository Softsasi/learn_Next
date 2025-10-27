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
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      <Input
        id={id}
        ref={ref}
        readOnly={readOnly}
        className={`${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''} ${
          className || ''
        }`}
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
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        readOnly={readOnly}
        rows={4}
        className={`flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 ${
          readOnly ? 'bg-gray-50 cursor-not-allowed' : ''
        } ${className || ''}`}
        {...props}
      />
    </div>
  );
});

ProfileTextAreaField.displayName = 'ProfileTextAreaField';
