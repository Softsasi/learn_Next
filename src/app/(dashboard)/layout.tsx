'use client';

import { useAuth } from '@/context/authProvider';
import UnAuthorize from './_components/UnAuthorize';

const DashBoardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useAuth();

  // Auth check
  if (!user) {
    return <UnAuthorize />;
  }

  return <div>{children}</div>;
};

export default DashBoardLayout;
