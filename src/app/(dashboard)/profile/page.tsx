'use client';

import { useAuth } from '@/context/authProvider';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../actions';
import { ErrorMessage } from './_components/ErrorMessage';
import { ProfileForm } from './_components/ProfileForm';
import { ProfileHeader } from './_components/ProfileHeader';
import { ProfileSkeleton } from './_components/ProfileSkeleton';

const ProfilePage = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserInfo = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserInfo(userId);

      if (data.code !== 200 || !data) {
        setError(data.error || 'An unexpected error occurred');
        return;
      }

      setUserInfo(data.user as unknown as IUser);
    } catch (err) {
      setError('Failed to fetch user information');
      console.error('Error fetching user info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserInfo(user.userId);
    }

    return () => {
      setUserInfo(null);
    };
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update profile logic
    console.log('Update profile submitted');
  };

  // Auth check
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader firstName={userInfo?.user.firstName} />

        {loading && <ProfileSkeleton />}

        {error && !loading && <ErrorMessage message={error} />}

        {!loading && !error && userInfo && (
          <ProfileForm userInfo={userInfo} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
