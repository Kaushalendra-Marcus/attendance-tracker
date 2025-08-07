// next.config.ts
import withPWA from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
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
