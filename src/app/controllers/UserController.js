import Joi from '@hapi/joi';
import { validate } from 'gerador-validador-cpf';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const page = Math.round(req.query.page) > 0 || 1;

    const userList = await User.findAll({
      offset: page * 10 - 10,
      limit: 10,
      attributes: {
        exclude: ['password_hash'],
      },
    });

    return res.json(userList);
  }

  async show(req, res) {
    if (!req.userId) {
      try {
        const _validated = await Joi.string()
          .uuid()
          .validateAsync(req.params.id);
      } catch (err) {
        return res
          .status(400)
          .json({ error: 'You must provide a valid user ID' });
      }
    }

    const id = req.userId || req.params.id;

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
      cpf: Joi.string()
        .length(11)
        .custom((value) => {
          if (!validate(value)) throw new Joi.ValidationError('Not valid cpf');

          return value;
        }, 'validate cpf'),
    }).options({ presence: 'required' });

    let body;
    const { cpf } = req.body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    body.cpf = cpf;

    let created;

    try {
      created = (await User.create(body)).get({ plain: true });

      delete created.password_hash;
      delete created.created_at;
      delete created.updated_at;

      return res.status(201).json(created);
    } catch (err) {
      if (err.fields) {
        if (err.fields.email)
          return res
            .status(409)
            .json({ error: 'Email already in use', fields: err.fields });

        if (err.fields.cpf)
          return res
            .status(409)
            .json({ error: 'CPF already in use', fields: err.fields });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req, res) {
    const schema = Joi.object({
      email: Joi.string().email(),
      oldPassword: Joi.string().alphanum().min(8).max(20),
      password: Joi.string().alphanum().min(8).max(20),
    }).with('password', 'oldPassword');

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request', err: { ...err } });
    }

    const id = req.userId || req.params.id;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });

    const { oldPassword, password } = body;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password) {
      const passwordMatches = await user.checkPassword(oldPassword);

      if (!passwordMatches) {
        return res.status(401).json({
          error: 'The provided password is not correct',
          fields: { oldPassword },
        });
      }
    }

    try {
      const updated = (await user.update(body)).get({ plain: true });

      delete updated.password_hash;

      return res.status(200).json(updated);
    } catch (err) {
      if (err.fields) {
        if (err.fields.email)
          return res
            .status(409)
            .json({ error: 'Email already in use', fields: err.fields });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
