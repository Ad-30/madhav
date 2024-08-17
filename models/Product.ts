import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
    productId: string;
    name: string;
    description: string;
    category: string;
    images: string[];
    sizes: string[];
    stockLevels: {
        [size: string]: number;
    };
    priceLevels: {
        [size: string]: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Poshak', 'Accessories', 'Puja Items'],
    },
    images: [{
        type: String,
        required: true,
    }],
    sizes: [{
        type: String,
        required: true,
    }],
    stockLevels: {
        type: Map,
        of: Number,
        default: {},
    },
    priceLevels: {
        type: Map,
        of: Number,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.models.Products || mongoose.model<IProduct>('Products', ProductSchema);

export default Product;