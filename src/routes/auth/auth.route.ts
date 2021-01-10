import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { registerValidation, loginValidation } from './validation';
import ACCESS_TOKEN from '../../helpers/index';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    await registerValidation.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      message: err.errors,
    });
  }

  const emailExists = await User.findOne({
    email: req.body.email,
  });

  if (emailExists) {
    return res.status(400).json({
      message: 'Email already taken',
    });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: hashedPassword,
  });

  try {
    const registerUser = await user.save();

    const { _id, username, email } = registerUser;

    return res.status(200).json({
      user: { _id, username, email },
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginValidation.validate(req.body);
  } catch (err) {
    return res.status(400).json({
      message: err.errors,
    });
  }
  // check if the user exists
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(404).json({
      message: 'invalid email or password',
    });
  }
  if (user) {
    const validatePassword = bcrypt.compareSync(
      req.body.password,
      user.password,
    );
    if (!validatePassword) {
      return res.status(400).json({
        message: 'invalid email or password',
      });
    }
  }

  const loggedInUser = {
    // eslint-disable-next-line no-underscore-dangle
    _id: user._id,
    username: user.username,
  };

  const token = jwt.sign(loggedInUser, ACCESS_TOKEN);

  return res.status(200).json({
    token,
  });
});

module.exports = router;
