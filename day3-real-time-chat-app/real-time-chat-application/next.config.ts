/** @type {import('next').NextConfig} */
interface WebpackConfig {
  externals: Record<string, string>[];
}

interface NextConfig {
  reactStrictMode: boolean;
  webpack: (config: WebpackConfig, options: { isServer: boolean }) => WebpackConfig;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals.push({
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
      });
    }
    return config;
  },
};

module.exports = nextConfig;