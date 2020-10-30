import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({

    email: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);