import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  const response = await fetch(imageUrl)

  if (!response.ok) {
    return new NextResponse('Failed to fetch image', { status: response.status })
  }

  const contentType = response.headers.get('content-type')
  const body = await response.arrayBuffer()

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}