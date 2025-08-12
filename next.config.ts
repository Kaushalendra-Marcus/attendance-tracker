import withPWA from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's now automatic
  compiler: {
    removeConsole: !isDev
  },
}

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: isDev,
  }
})(nextConfig)