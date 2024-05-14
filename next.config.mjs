/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/dashboard',
                destination: '/dashboard/orders',
                permanent: true
            },
            {
                source: '/',
                destination: '/dashboard',
                permanent: true
            }
        ]
    }
};

export default nextConfig;
