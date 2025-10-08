import LoginForm from '../_componnets/LoginForm';
import SidePanel from '../_componnets/SidePanel';
import SocialLoginButtonLogin from '../_componnets/SocialLoginButtonLogin';

const SigninPage = () => {


  return (
    <div className="flex h-screen bg-gray-50">
      <SidePanel />
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>
          <LoginForm />
          <SocialLoginButtonLogin />
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
