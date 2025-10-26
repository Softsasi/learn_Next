import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.userProfile.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      authUser: true,
    },
  });

  return NextResponse.json(
    {
      message: 'User profiles retrieved successfully',
      users,
      code: 200,
    },
    { status: 200 }
  );
}

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const userId = searchParams.get('userId');

//   if (!userId) {
//     return new Response(JSON.stringify({ error: 'User ID is required' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     const deletedUser = await prisma.user.delete({
//       where: { id: userId },
//     });

//     return new Response(JSON.stringify(deletedUser), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'User not found' }), {
//       status: 404,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
