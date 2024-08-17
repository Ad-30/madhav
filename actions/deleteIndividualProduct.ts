export const deleteProductById = async (productId: string): Promise<any> => {
    try {
        const res = await fetch(`/api/individualproduct?id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to delete product');
        }

        return data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
};