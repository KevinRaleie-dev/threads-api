import jwt from 'jsonwebtoken';
import ACCESS_TOKEN from './index';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // either return undefined or return a token
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN, (err, loggedInUser) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.loggedInUser = loggedInUser;
    return next();
  });

  return next();
};

export default authenticate;
