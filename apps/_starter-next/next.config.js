/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@affex/auth-core",
		"@affex/ui-kit",
		"@affex/design-tokens",
		"@affex/shared-types",
		"@affex/shared-config",
	],
};

module.exports = nextConfig;
