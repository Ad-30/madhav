export interface ProductProps {
    _id: string;
    productId: string;
    name: string;
    description: string;
    priceLevels: Record<string, number>;
    category: string;
    images: string[];
    sizes: string[];
    stockLevels: Record<string, number>;
    createdAt: string;
    updatedAt: string;
    __v: number;
}