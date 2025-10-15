'use client';

import { deleteUser } from '@/app/users/_actions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const DeleteUserBtn = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const handleDeleteUser = async (userId: string) => {
    console.log('I am clicked', userId);
    const res = await deleteUser(userId);
    console.log('User deleted:', res);

    // we can also refresh the page here if needed
    // router.refresh();
  };

  return (
    <Button
      className="mt-2 ml-2"
      variant="destructive"
      onClick={() => handleDeleteUser(userId)}
    >
      Delete User
    </Button>
  );
};

export default DeleteUserBtn;
