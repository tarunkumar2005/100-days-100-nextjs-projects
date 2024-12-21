import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const headers = new Headers(response.headers)
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/jpeg')
    return new NextResponse(arrayBuffer, { headers })
  } catch (error) {
    console.error('Failed to fetch image:', error)
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}