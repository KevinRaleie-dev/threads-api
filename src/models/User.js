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
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);