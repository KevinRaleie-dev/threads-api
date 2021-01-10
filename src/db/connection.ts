import mongoose from 'mongoose';

const connection = async (db: string) => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
  }
};

export default connection;
