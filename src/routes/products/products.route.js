import express from 'express';
import { Product } from '../../models/Product';
import { productValidation } from './validation';

const router = express.Router();

// get all products from the database
router.get('/', async (_, res) => {
    const products = await Product.find()
        .populate('owner')
        .then(product => res.json(product))
        .catch(err => res.status(500).json({
        message: err.message
    }));

    return products;
});

module.exports = router