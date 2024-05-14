/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/dashboard',
                destination: '/dashboard/orders',
                permanent: true
            }
        ]
    }
};

export default nextConfig;
