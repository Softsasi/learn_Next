interface ProfileHeaderProps {
  firstName?: string;
}

export const ProfileHeader = ({ firstName }: ProfileHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile</h1>
      <p className="text-lg text-gray-600">
        {firstName
          ? `Welcome back, ${firstName}!`
          : 'Manage your profile information'}
      </p>
    </div>
  );
};
