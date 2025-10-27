import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-48 bg-gray-200 rounded-md mb-2 animate-pulse" />
        <div className="h-6 w-64 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Cards Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
