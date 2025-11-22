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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with accent line */}
        <div className="mb-8">
          <ProfileHeader firstName={userInfo?.user.firstName} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="animate-pulse space-y-6">
            <ProfileSkeleton />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-center space-x-4">
            <div className="text-red-600 text-2xl">⚠️</div>
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Form State */}
        {!loading && !error && userInfo && (
          <ProfileForm userInfo={userInfo} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
