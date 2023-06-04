/** @type {import('next').NextConfig} */
const { env } = require('./env-config');

const nextConfig = {
    env,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        });
    
        return config;
    }
}

module.exports = nextConfig
