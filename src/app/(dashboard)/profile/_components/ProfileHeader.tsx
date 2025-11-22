interface ProfileHeaderProps {
  firstName?: string;
}

export const ProfileHeader = ({ firstName }: ProfileHeaderProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile
        </h1>
      </div>
      <p className="text-lg text-gray-600 font-medium">
        {firstName
          ? `Welcome back, ${firstName}! 👋`
          : 'Manage your profile information'}
      </p>
      <p className="text-sm text-gray-500 mt-2">Update your personal details and account settings</p>
    </div>
  );
};
