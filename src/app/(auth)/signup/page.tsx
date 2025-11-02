import ErrorRole from '../_componnets/ErrorRole';
import SidePanel from '../_componnets/SidePanel';
import SignUpForm from '../_componnets/SignUpForm';
import SocialLoginButton from '../_componnets/SocialLoginButton';

type SignUpPageParams = {
  searchParams: { [key: string]: string | undefined };
};

const SignUpPage = async ({ searchParams }: SignUpPageParams) => {
  const data = await searchParams;
  const role = data.role || 'student';

  if (role !== 'student' && role !== 'teacher') {
    return <ErrorRole />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidePanel />
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Create your {role === 'teacher' ? 'Teacher' : 'Student'} account
            </h1>
            <p className="mt-2 text-gray-600">
              Get started with your free account
            </p>
          </div>
          <SignUpForm role={role} />
          <SocialLoginButton role={role} />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
