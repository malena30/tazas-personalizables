import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://kyathos.shop';

    const baseRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/customizer`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    try {
        const products = await getProducts();
        const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
            url: `${baseUrl}/products/${product.slug || product.id}`,
            lastModified: new Date(product.updated_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...baseRoutes, ...productRoutes];
    } catch (error) {
        console.error('Error generating sitemap product routes:', error);
        return baseRoutes;
    }
}
