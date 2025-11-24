'use client';

import AppConfig from '@/config/appConfig';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type SignUpFormProps = {
  role: 'student' | 'teacher';
};

const SignUpForm = ({ role }: SignUpFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: role || 'student',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    formData['role'] = role;

    if (validateForm()) {
      const res = await fetch(`${AppConfig.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log('Response from server:', data);

      if (res.ok) {
        // Handle successful registration
        console.log('Registration successful:', data);
        toast.success('Registration successful! Please sign in.', {
          position: 'top-right',
          style: { background: '#22c55e', color: '#fff' },
          cancel: true,
        });

        setTimeout(() => {
          router.push('/signin');
        }, 1500);
      } else {
        // Handle registration error
        console.error('Registration failed:', data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-3 border ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            className={`w-full px-4 py-3 pr-12 border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
          />
          {showPassword ? (
            <EyeOff
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
            />
          )}
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            minLength={8}
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="••••••••"
          />
          {showPassword ? (
            <EyeOff
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
            />
          ) : (
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 w-5 h-5"
            />
          )}
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
          I agree to the{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Privacy Policy
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignUpForm;
