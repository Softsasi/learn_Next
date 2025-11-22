'use client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { IUser } from '@/types';
import { fromISODateTime } from '@/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import ProfileImageUpload from '../../_components/ProfileImageUpload';
import { ProfileFormField, ProfileTextAreaField } from './ProfileFormField';

interface ProfileFormProps {
  userInfo: IUser;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({ userInfo }: ProfileFormProps) => {
  console.log(userInfo);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      userId: userInfo?.id || '',
      firstName: userInfo?.user.firstName || '',
      lastName: userInfo?.user.lastName || '',
      dob: fromISODateTime(userInfo?.user.dob) || '',
      bio: userInfo?.user.bio || '',
      email: userInfo?.email || '',
      role: userInfo?.role || '',
      phone: userInfo?.user.phone || '',
      address: userInfo?.user.address || '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.patch('/api/profile', data);
      console.log(res);

      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center space-x-4">
        <ProfileImageUpload userId={userInfo?.id} avatarUrl={userInfo?.user.avatarUrl} />
      </div>

      {/* Personal Information Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-4">
          <CardTitle className="text-xl font-bold text-gray-800">👤 Personal Information</CardTitle>
          <CardDescription className="text-gray-600">Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <input type="hidden" {...register('userId')} value={userInfo?.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileFormField
              id="firstName"
              label="First Name"
              placeholder="Enter your first name"
              {...register('firstName')}
            />
            <ProfileFormField
              id="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              {...register('lastName')}
            />
          </div>

          <ProfileFormField
            id="dob"
            label="Date of Birth"
            type="date"
            {...register('dob')}
          />

          <ProfileTextAreaField
            id="bio"
            label="Bio"
            placeholder="Tell us about yourself..."
            {...register('bio')}
          />
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 pb-4">
          <CardTitle className="text-xl font-bold text-gray-800">🔐 Account Information</CardTitle>
          <CardDescription className="text-gray-600">
            Your account details and credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <ProfileFormField
            id="email"
            label="Email Address"
            type="email"
            readOnly
            {...register('email')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileFormField
              id="role"
              label="Role"
              readOnly
              {...register('role')}
            />
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-gray-700 block">
                Verification Status
              </label>
              <div className="h-10 flex items-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    userInfo?.verified
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${userInfo?.verified ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                  {userInfo?.verified ? '✓ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 pb-4">
          <CardTitle className="text-xl font-bold text-gray-800">📞 Contact Information</CardTitle>
          <CardDescription className="text-gray-600">How people can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <ProfileFormField
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            {...register('phone')}
          />

          <ProfileFormField
            id="address"
            label="Address"
            placeholder="Enter your address"
            {...register('address')}
          />
        </CardContent>
        <CardFooter className="border-t border-gray-200 pt-6 bg-gray-50 rounded-b-lg">
          <Button
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            💾 Update Profile
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
