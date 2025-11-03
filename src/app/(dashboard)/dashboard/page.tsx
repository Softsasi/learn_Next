import { authDetails } from '@/lib/auth';

const DashBoardPage = async () => {
  const user = await authDetails();

  return <div>{user ? `Welcome ${user.firstName}` : 'Please log in'}</div>;
};

export default DashBoardPage;
