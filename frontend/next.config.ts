import type { NextConfig } from 'next'

const api = process.env.API_PROXY_TARGET || 'http://localhost:8002'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Django APPEND_SLASH 301 (/path → /path/) va Next 308 (/path/ → /path)
  // bir-birini quvib, /api/* da ERR_TOO_MANY_REDIRECTS beradi.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${api}/api/:path*` },
      { source: '/media/:path*', destination: `${api}/media/:path*` },
    ]
  },
}

export default nextConfig
