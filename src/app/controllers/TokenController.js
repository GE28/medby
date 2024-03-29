import { sign } from 'jsonwebtoken';
import Joi from '@hapi/joi';

import User from '../models/User';
import config from '../../config/jsonwebtoken';

const { options, secret } = config;

class TokenController {
  async store(req, res) {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().alphanum(),
    }).options({ presence: 'required' });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const { password, email } = body;

    let user = await User.findOne({
      where: { email },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    const passwordMatches = await user.checkPassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }

    user = user.get({ plain: true });

    const token = sign({ userType: 'U', userId: user.id }, secret, options);

    delete user.password_hash;

    return res.json({ user, token });
  }
}

export default new TokenController();
