import { auth } from '@/auth';
import { redirect } from 'next/navigation';

 const page =async () => {
  // if user is not admin, redirect to home page

  const data = await auth();
  const user = data?.user;
  if(user?.role !== 'ADMIN'){
    redirect('/');
  }



  return (
    <div> Admin page</div>
  )
}


export default page
