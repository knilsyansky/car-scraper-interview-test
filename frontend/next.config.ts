import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.carsensor.net',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
