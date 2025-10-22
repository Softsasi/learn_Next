import { generateFakePost } from '@/lib/faker';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = [];

  for (let i = 0; i < 100; i++) {
    posts.push(generateFakePost());
  }

  const res = await prisma.post.createMany({
    data: posts,
  });

  return new Response(JSON.stringify(res.count), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
