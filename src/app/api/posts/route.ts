import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

  return NextResponse.json(
    {
      message: 'Post created successfully',
      post: res,
      code: 201,
    },
    { status: 201 }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  console.log('Search Parameters:', searchParams.toString());

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const skip = (page - 1) * limit;

  console.time('query');
  const posts = await prisma.post.findMany({
    take: limit,
    skip: skip,
  });
  console.timeEnd('query');

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
