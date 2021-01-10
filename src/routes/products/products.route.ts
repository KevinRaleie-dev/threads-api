/* eslint-disable no-underscore-dangle */
import express from 'express';
import authenticate from '../../helpers/verifyToken';
import Product from '../../models/Product';
import User from '../../models/User';

const router = express.Router();

// get all products from the database
router.get('/', async (_, res) => {
  const products = await Product.find()
    .populate('owner')
    .then((product) => res.json(product))
    .catch((err) => res.status(500).json({
      message: err.message,
    }));

  return products;
});

// create a product
router.post('/create_product', authenticate, async (req, res) => {
  // try adding the product
  try {
    const product = new Product({
      ...req.body,
      owner: req.loggedInUser._id,
    });

    await product.save();

    // add the product to the array of products of the user
    const user = await User.findById({ _id: product.owner });
    user.products.push(product);

    await user.save();

    // return a response to the user that the product was added

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
});

// TODO: update and delete product thats been added by you.

module.exports = router;