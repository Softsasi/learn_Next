import { Button } from '@/components/ui/button';
import { getUsers } from './_actions';
import DeleteUserBtn from './_componnets/DeleteUserBtn';

const page = async () => {
  // Method 1: Directly from database (Not recommended)
  // const users = await prisma.user.findMany();

  // Method 2: From server action ( recommended)
  const users = await getUsers();

  // Method 3: From API route (Recommended)
  // const res = await fetch('http://localhost:3000/api/users', {
  //   cache: 'no-store',
  // });
  // const users = await res.json();

  const handleDeleteUser = async () => {
    // console.log(id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">User Page</h1>

      <ul className="mt-4 space-y-2">
        {users ? (
          users.map((user:any) => {
            return (
              <li className="p-2 border rounded bg-white shadow" key={user.id}>
                <p className="font-medium">ID: {user.id}</p>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">
                  Name:
                  {user.firstName + ' ' + user.lastName}
                </p>

                <Button className="mt-2" variant="secondary">
                  View Details
                </Button>

                <DeleteUserBtn userId={user.id} />
              </li>
            );
          })
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default page;
