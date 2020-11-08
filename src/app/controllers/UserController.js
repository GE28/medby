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

  async store(req, res) {
    try {
      const created = await User.create(req.body);
    } catch (err) {
      if (err.fields) {
        if (err.fields.email)
          return res.status(409).json({ error: 'Email already in use' });

        if (err.fields.cpf)
          return res.status(409).json({ error: 'CPF already in use' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json(req.body);
  }
}

export default new UserController();
