import { verify } from 'jsonwebtoken';
import config from '../config/jsonwebtoken';

const { secret } = config;

export default function tokenValidatorCall(target) {
  return function tokenValidator(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    token = token.substring(7); // Remove 'Bearer '

    try {
      const decoded = verify(token, secret);

      req.userType = decoded.userType;
      req.userId = decoded.userId;
    } catch (err) {
      if (token === process.env.ADMIN_KEY) {
        req.userType = 'A'; // Admin
      } else
        return res.status(401).json({ message: 'Expired or invalid token' });
    }

    if (target)
      if (req.userType !== target) {
        const { path } = req;

        return res
          .status(403)
          .json({ error: `You do not have permission to access ${path}` });
      }

    return next();
  };
}
