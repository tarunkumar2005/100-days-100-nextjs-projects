import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const headers = new Headers()
    headers.set('Content-Type', response.headers['content-type'])
    return new NextResponse(response.data, { headers })
  } catch (error) {
    console.error('Failed to fetch image:', error)
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}