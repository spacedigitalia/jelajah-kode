import ProductsDetails from '@/components/dashboard/products/details/ProductsDetails';

import { fetchProductsById } from '@/utils/fetching/FetchProducts';

import { generateProductsDetailsMetadata } from '@/helper/meta/Metadata';

export async function generateMetadata({ params }: { params: Promise<{ productsId: string }> }) {
    return generateProductsDetailsMetadata(params);
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ productsId: string }> }) {
    const { productsId } = await params;
    const product = await fetchProductsById(productsId);
    return (
        <ProductsDetails product={product} />
    );
}
