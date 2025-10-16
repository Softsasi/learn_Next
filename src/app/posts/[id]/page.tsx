import { prisma } from '@/lib/prisma';

type tParams = Promise<{ id: string }>;

const page = async ({ params }: { params: tParams }) => {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  console.table(post);

  return <div>page</div>;
};

export default page;
