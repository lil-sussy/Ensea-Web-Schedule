/** @type {import('next').NextConfig} */

const server = process.env.NODE_ENV.startsWith('dev') ?
  'http://localhost:3000'  // process.env.VERCEL_URL is undefined at this point of execution
  :
  'https://ews.athena.asso-ensea.fr'

module.exports = {
  env: {
    server: server
  },
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/sso',
        destination: 'https://identites.ensea.fr/cas/login?service='+server+'/api/cas',
        permanent: false,
        basePath: false
      },
    ]
  },
}
