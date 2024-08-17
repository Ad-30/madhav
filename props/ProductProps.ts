export interface ProductProps {
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