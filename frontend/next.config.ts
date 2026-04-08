import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.carsensor.net|placehold.*',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
