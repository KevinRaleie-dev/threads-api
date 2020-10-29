import mongoose  from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    stock: {
        type: Number
    },
    image: {
        type: String
    },
}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);

