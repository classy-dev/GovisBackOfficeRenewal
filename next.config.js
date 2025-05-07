/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'dev-govis.s3.ap-northeast-2.amazonaws.com',
      'dev-govis-ai.s3.ap-northeast-2.amazonaws.com',
      'govis.s3.ap-northeast-2.amazonaws.com',
      'govis-ai.s3.ap-northeast-2.amazonaws.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/bo/user',
        destination: '/v1/bo/user',
        permanent: true,
      },
      {
        source: '/fc/notice/:id',
        destination: '/v1/fc/notice/:id',
        permanent: true,
      },
      {
        source: '/fc/forums/:id',
        destination: '/v1/fc/forums/:id',
        permanent: true,
      },
      {
        source: '/fc/interiors/:id',
        destination: '/v1/fc/interiors/:id',
        permanent: true,
      },
      {
        source: '/fc/returns/:id',
        destination: '/v1/fc/returns/:id',
        permanent: true,
      },
      {
        source: '/fc/device-support/:id',
        destination: '/v1/fc/device-support/:id',
        permanent: true,
      },
    ];
  },
  compiler: {
    emotion: {
      sourceMap: true,
      autoLabel: 'always',
      labelFormat: '[local]',
    },
  },
};

module.exports = nextConfig;
