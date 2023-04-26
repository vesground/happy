const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'components', 'helpers', 'utils', 'styles', 'services'], // By default, Next.js will run ESLint for all files in the pages/, app (only if the experimental appDir feature is enabled), components/, lib/, and src/ directories.
    files: ['public/manifest.json']
  }
});
