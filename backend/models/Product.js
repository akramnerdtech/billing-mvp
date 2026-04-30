import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: [0, 'Price must be positive']
        },
        quantity: {
            type: Number,
            required: [true, 'Please add a quantity'],
            min: [0, 'Quantity cannot be negative']
        },
        imageUrl: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
