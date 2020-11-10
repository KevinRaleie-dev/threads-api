import mongoose from 'mongoose';

export const connection = async (db) => {

    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

    } catch (error) {
        console.log('error', error);
    }
}