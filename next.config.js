/** @type {import('next').NextConfig} */
const service = process.env.NODE_ENV.startsWith('dev') ?
  'http://localhost:3000'  // process.env.VERCEL_URL is undefined at this point of execution
  :
  'https://ews.athena.asso-ensea.fr'
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    casService: service,
  },
  async redirects() {
    return [
      {
        source: '/sso',
        destination: 'https://identites.ensea.fr/cas/login?service='+service,
        permanent: false,
        basePath: false
      },
    ]
  },
}

module.exports = nextConfig
