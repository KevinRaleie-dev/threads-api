import express from 'express';
import { User } from '../../models/User';

const router = express.Router();

// get all the users in the database
router.get('/', async (_, res) => {

    const users = await User.find().then(user => res.json(user)).catch(err => res.status(400).json({
        message: err.message
    }));

    return users;
});

module.exports = router;