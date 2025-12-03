import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Image Upload Skeleton */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex justify-center">
        <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full" />
      </div>

      {/* Personal Information Card Skeleton */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
          <div className="h-7 w-48 bg-gray-300 rounded-lg" />
          <div className="h-4 w-56 bg-gray-200 rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2.5">
                <div className="h-4 w-20 bg-gray-300 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
          </div>
          <div className="space-y-2.5">
            <div className="h-4 w-16 bg-gray-300 rounded" />
            <div className="h-24 w-full bg-gray-200 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Account Information Card Skeleton */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
          <div className="h-7 w-48 bg-gray-300 rounded-lg" />
          <div className="h-4 w-56 bg-gray-200 rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2.5">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2.5">
                <div className="h-4 w-20 bg-gray-300 rounded" />
                <div className="h-10 w-full bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card Skeleton */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
          <div className="h-7 w-48 bg-gray-300 rounded-lg" />
          <div className="h-4 w-56 bg-gray-200 rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2.5">
              <div className="h-4 w-24 bg-gray-300 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-lg" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
