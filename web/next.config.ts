import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_INVITE_URL: process.env.NEXT_PUBLIC_INVITE_URL ?? 'https://discord.com/oauth2/authorize?client_id=939363362402361386&scope=bot&permissions=0'
  }
};

export default withNextIntl(nextConfig);
