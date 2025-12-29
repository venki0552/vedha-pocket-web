/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["@vedha/shared"],
	experimental: {
		serverComponentsExternalPackages: ["@vedha/shared"],
	},
};

module.exports = nextConfig;
