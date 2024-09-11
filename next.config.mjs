/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			config.devtool = false;
		}

		// Exclude node_modules from source maps
		config.module.rules.push({
			test: /\.js$/,
			enforce: "pre",
			exclude: /node_modules/,
			use: ["source-map-loader"],
		});

		return config;
	},
};

export default nextConfig;