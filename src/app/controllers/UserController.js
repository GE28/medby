import Joi from '@hapi/joi';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const userList = await User.findAll({
      attributes: {
        exclude: ['password_hash'],
      },
    });

    return res.json(userList);
  }

  async show(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['created_at', 'updated_at', 'password_hash'],
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: 'The specified user was not found' });
    }

    return res.json(user);
  }

  async store(req, res) {
    const schema = Joi.object({
      name: Joi.string().max(72),
      email: Joi.string().email(),
      password: Joi.string().alphanum().min(8).max(20),
      cpf: Joi.string().length(11),
    }).options({ presence: 'required' });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    try {
      const created = await User.create(body);
    } catch (err) {
      if (err.fields) {
        if (err.fields.email)
          return res.status(409).json({ error: 'Email already in use' });

        if (err.fields.cpf)
          return res.status(409).json({ error: 'CPF already in use' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(201).json(body);
  }
}

export default new UserController();