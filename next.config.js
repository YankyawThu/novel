/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // The locales you want to support in your app
    locales: ["default", "en", "mm"],
    // The default locale you want to be used when visiting a non-locale prefixed path e.g. `/hello`
    defaultLocale: "default",
    localeDetection: false,
  },
  trailingSlash: false,
  env: {
    API_URL: process.env.API_URL,
    API_DOMAIN: process.env.API_DOMAIN,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  }
}

module.exports = nextConfig
