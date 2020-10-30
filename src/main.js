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
const port = 3000 || process.env.PORT;
const db = 'mongodb://localhost:27017/ecom';

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