import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.table(body);

  const { title, content, authorId, slug, published, thumbnail, tags, imageUrls } = body;

  if (!title || !content || !authorId || !slug) {
    return new Response(
      JSON.stringify({
        error: `Missing required fields ${!title ? 'title' : ''} ${
          !content ? 'content' : ''
        } ${!authorId ? 'authorId' : ''} ${!slug ? 'slug' : ''}`,
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
      slug,
      published: published ?? false,
      thumbnail,
      tags: tags ?? [],
      imageUrls: imageUrls ?? [],
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
  // console.log('Request', req.url);
  const { searchParams } = new URL(req.url);

  console.log('Search Parameters:', searchParams.toString());

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const skip = (page - 1) * limit;

  console.time('total posts count');

  const [posts, totalPost] = await Promise.all([
    await prisma.post.findMany({
      take: limit,
      skip: skip,
    }),
    await prisma.post.count(),
  ]);

  console.timeEnd('total posts count');

  // pagination info
  const totalPages = Math.ceil(totalPost / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const currentPage = page;
  const itemsPerPage = limit;
  const startItem = skip + 1;
  const endItem = Math.min(skip + limit, totalPost);
  const remainingItems = totalPost - endItem;

  // generate hetos link
  const href = new URL(req.url);
  const currentPageLink = href.href;
  const nextPageLink = hasNextPage
    ? `${href.origin}${href.pathname}?page=${
        currentPage + 1
      }&limit=${itemsPerPage}`
    : null;
  const prevPageLink = hasPrevPage
    ? `${href.origin}${href.pathname}?page=${
        currentPage - 1
      }&limit=${itemsPerPage}`
    : null;
  const firstPageLink =
    page > 1
      ? `${href.origin}${href.pathname}?page=1&limit=${itemsPerPage}`
      : null;
  const lastPageLink =
    page < totalPages
      ? `${href.origin}${href.pathname}?page=${totalPages}&limit=${itemsPerPage}`
      : null;

  return NextResponse.json(
    {
      posts,
      meta: {
        totalItems: totalPost,
        totalPages: totalPages,
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        startItem: startItem,
        endItem: endItem,
        remainingItems: remainingItems,
      },
      links: {
        current: currentPageLink,
        next: nextPageLink,
        prev: prevPageLink,
        first: firstPageLink,
        last: lastPageLink,
      },
    },
    { status: 200 }
  );
}
