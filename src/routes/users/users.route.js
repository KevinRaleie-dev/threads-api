import express from 'express';
import { User } from '../../models/User';
import { Product } from '../../models/Product';
import {authenticate} from '../../helpers/verifyToken';

const router = express.Router();

// get all the users in the database
router.get('/', authenticate, async (_, res) => {

    const users = await User.find().then(user => res.json(user)).catch(err => res.status(400).json({
        message: err.message
    }));

    return users;
});

// get a user by id and all their products
router.get('/:id', async (req, res) => {

    const findUserById = await User.findById( req.params.id ).populate('products')
                            .then(user => res.json(user))
                            .catch(err => res.json({
                                message: err.message
                            }));
    
    return findUserById;
});

// create a product
router.post('/create_product', authenticate, async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            image: req.body.image,
            owner: req.loggedInUser._id
        });
        await product.save();

        // const getUser = req.loggedInUser._id;

        const user = await User.findById({_id: product.owner});
        user.products.push(product);

        await user.save();

        res.status(201).json({
            success: true,
            data: product
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error: ${error.message}`
        })
    }
});

// update a user by id
router.patch('/update/:id', async (req, res) => {
    const updateUser = await User.findById(req.params.id).then(user => {
        user.email = req.body.email;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save().then(() => {
            res.json({
                message: 'User updated successfully'
            })
        })
        .catch(err => res.status(400).json({
            message: `Error: ${err.message}`
        }));
    });

    return updateUser;
});

// delete a user
router.delete('/delete/:id', async (req, res) => {
    const deleteUser = await User.findByIdAndDelete(req.params.id)
                        .then(() => {
                            res.status(200);
                        })
                        .catch(err => {
                            res.status(400).json({
                                message: `Error: ${err.message}`
                            })
                        });
    return deleteUser;
})


module.exports = router;