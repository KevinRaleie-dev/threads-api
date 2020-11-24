import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import auth from './routes/auth/auth.route';
import users from './routes/users/users.route';
import products from './routes/products/products.route';
import {
    connection
} from './db/connection';

const app = express();
const port = process.env.PORT || 3000;
const db = process.env.MONGO_DB

const main = () => {

    connection(db);

    app.use(cors())
    app.use(morgan('tiny'));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use('/auth', auth);
    app.use('/users', users);
    app.use('/products', products);

    app.listen(port, () => {
        console.log(`Server runninng on http://localhost:${port}`);
    });
}

main();