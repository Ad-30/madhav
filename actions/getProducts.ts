import axios from 'axios';

interface FetchProductsParams {
    offset: number;
    limit: number;
    category: string;
}

interface Product {
    src: string;
    id: string;
    name: string;
    category: string;
    price: string;
    totalStock: string;
    alt: string;
}

interface FetchProductsResponse {
    data: Product[];
    totalItems: number; // Include totalItems to match the new response format
}

export const getProducts = async ({
    offset,
    limit,
    category
}: FetchProductsParams): Promise<FetchProductsResponse> => {
    try {
        const response = await axios.get<FetchProductsResponse>('/api/product', {
            params: {
                offset,
                limit,
                category
            }
        });

        return response.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // or return a default value
    }
};