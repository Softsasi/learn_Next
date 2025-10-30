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
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="hidden" {...register('userId')} value={userInfo?.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Tell us about yourself"
            {...register('bio')}
          />
        </CardContent>
      </Card>

      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your account details and credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileFormField
            id="email"
            label="Email Address"
            type="email"
            readOnly
            {...register('email')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileFormField
              id="role"
              label="Role"
              readOnly
              {...register('role')}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Verification Status
              </label>
              <div className="h-9 flex items-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userInfo?.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {userInfo?.verified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How people can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        <CardFooter className="border-t pt-6">
          <Button type="submit" className="w-full md:w-auto">
            Update Profile
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
