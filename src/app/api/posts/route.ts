import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.table(body);

  const { title, content, authorId } = body;

  if (!title || !content || !authorId) {
    return new Response(
      JSON.stringify({
        error: `Missing required fields ${!title ? 'title' : ''} ${
          !content ? 'content' : ''
        } ${!authorId ? 'authorId' : ''}`,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const res = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },

    omit: {
      updatedAt: true,
      createdAt: true,
    },
  });

  return new Response(JSON.stringify(res), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  const posts = await prisma.post.findMany();

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
