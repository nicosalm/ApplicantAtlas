/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';


// Default API URL for development
let apiUrl = 'http://localhost:8080';

// If in production, use the production API URL
if (isProd) {
  apiUrl = 'https://api.productiondomain.com';
} else if (process.env.CODESPACES) {
  // If running in GitHub Codespaces (and not in production), set the API URL dynamically
  apiUrl = `https://${process.env.CODESPACE_NAME}-8080.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
}

const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: apiUrl
    }
}

module.exports = nextConfig