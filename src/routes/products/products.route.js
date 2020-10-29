import express from 'express';
import { Product } from '../../models/Product';
import { productValidation } from './validation';

const router = express.Router();

// get all products from the database
router.get('/', async (_, res) => {
    const products = await Product.find()
        .then(product => res.json(product))
        .catch(err => res.status(500).json({
        message: err.message
    }));

    return products
});

// create a product in the database
router.post('/create', async (req, res) => {
    // validate the input from the request body
    try {
        await productValidation.validate(req.body);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }

    // can i have the same product with the same name?
    // i'll let this one slide for now 

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        image: req.body.image
    });
    
    try {

        const saveProduct = await product.save();

        return res.status(200).json({
            data: saveProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});



module.exports = router