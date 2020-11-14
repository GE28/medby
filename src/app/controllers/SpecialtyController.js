import Joi from '@hapi/joi';
import Unit from '../models/Unit';
import Specialty from '../models/Specialty';

class SpecialtyController {
  async index(req, res) {
    const page = Math.round(req.query.page) || 1;

    const specList = await Specialty.findAll({
      // If page == 1 show the first 10 entries, if 2 show from 11 to 20
      offset: page * 10 - 10,
      limit: 10,
    });

    return res.json(specList);
  }

  async show(req, res) {
    const { id } = req.params;

    const specialty = await Specialty.findByPk(id, {
      include: [
        {
          model: Unit,
          as: 'units',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
    });

    if (!specialty) {
      return res
        .status(404)
        .json({ error: 'Specified specialty was not found' });
    }

    return res.json(specialty);
  }

  async store(req, res) {
    const schema = Joi.object({
      name: Joi.string().max(32),
      display_name: Joi.string().max(32),
      base_price: Joi.number().max(999999999.99),
    }).options({ presence: 'required' });

    let body, id;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { name, display_name } = body;

    try {
      const specialty = await Specialty.findOne({
        where: { name, display_name },
      });

      if (specialty) {
        return res
          .status(409)
          .json({ error: 'Specialty with this same data found' });
      }

      const created = await Specialty.create(body);

      id = created.id;
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ id, ...body });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Joi.object({
      name: Joi.string().max(32),
      display_name: Joi.string().max(32),
      base_price: Joi.number().max(999999999.99),
    });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { name, display_name } = body;

    const spec = await Specialty.findByPk(id);

    if (!spec) {
      return res
        .status(404)
        .json({ error: 'Specified speciality was not found' });
    }

    const specialty = await Specialty.findOne({
      where: { name, display_name },
    });

    if (specialty) {
      return res
        .status(409)
        .json({ error: 'Specialty with this same data found' });
    }

    try {
      const updated = await spec.update(body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const specialty = await Specialty.findByPk(id);

    if (!specialty) {
      return res
        .status(400)
        .json({ error: 'Specified specialty was not found' });
    }

    const deleted = await specialty.destroy();

    return res.json({ message: 'Specified specialty successful deleted' });
  }
}

export default new SpecialtyController();
