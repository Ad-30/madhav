import axios from 'axios';

interface FetchProductsParams {
    id: string;
}

interface ProductProps {
    _id: string;
    productId: string;
    name: string;
    description: string;
    price: Record<string, number>;
    category: string;
    images: string[];
    sizes: string[];
    stockLevels: Map<string, number>;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface FetchProductsResponse {
    success: boolean;
    data: ProductProps;
}

export const getIndividualProduct = async ({
    id
}: FetchProductsParams): Promise<FetchProductsResponse> => {
    try {
        const response = await axios.get<FetchProductsResponse>('/api/individualproduct', {
            params: {
                id
            }
        });
        return response.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};