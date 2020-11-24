/* eslint-disable no-param-reassign */
import express from 'express';
import User from '../../models/User';
import authenticate from '../../helpers/verifyToken';

const router = express.Router();

// get all the users in the database
router.get('/', async (_, res) => {
  const users = await User.find()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({
      message: err.message,
    }));

  return users;
});

// get a user by id and all their products
router.get('/:id', authenticate, async (req, res) => {
  const findUserById = await User.findById(req.params.id)
    .populate('products')
    .then((user) => res.json(user))
    .catch((err) => res.json({
      message: err.message,
    }));

  return findUserById;
});

// update a user by id
router.patch('/update/:id', authenticate, async (req, res) => {
  const updateUser = await User.findById(req.params.id).then((user) => {
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;

    user
      .save()
      .then(() => {
        res.json({
          message: 'User updated successfully',
        });
      })
      .catch((err) => res.status(400).json({
        message: `Error: ${err.message}`,
      }));
  });

  return updateUser;
});

// delete a user
router.delete('/delete/:id', authenticate, async (req, res) => {
  const deleteUser = await User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      res.status(400).json({
        message: `Error: ${err.message}`,
      });
    });
  return deleteUser;
});

module.exports = router;
