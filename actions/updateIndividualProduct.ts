export const updateProductById = async (productId: string, updatedData: Record<string, any>) => {
    try {
        console.log(updatedData);
        const res = await fetch(`/api/individualproduct?id=${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        console.log(res);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Check if response is not empty
        const text = await res.text();
        if (!text) {
            throw new Error('Empty response body');
        }

        // Parse JSON
        const data = JSON.parse(text);


        return data;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
};