import Joi from '@hapi/joi';
import Unit from '../models/Unit';
import Specialty from '../models/Specialty';

class UnitController {
  async index(req, res) {
    const unitList = await Unit.findAll();

    return res.json(unitList);
  }

  async show(req, res) {
    const { id } = req.params;

    const unit = await Unit.findByPk(id, {
      include: [
        {
          model: Specialty,
          as: 'specialties',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
    });

    if (!unit) {
      return res.status(404).json({ error: 'Specified unit was not found' });
    }

    return res.json(unit);
  }

  async store(req, res) {
    const schema = Joi.object({
      name: Joi.string().max(56),
      cep: Joi.string().length(8),
      complements: Joi.string().max(255),
    }).options({ presence: 'required' });

    let body, id;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { complements, cep } = body;

    try {
      const unit = await Unit.findOne({
        where: { cep, complements },
      });

      if (unit) {
        return res
          .status(409)
          .json({ error: 'Unit with this same address found' });
      }

      const created = await Unit.create(body);

      id = created.id;
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ id, ...body });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Joi.object({
      name: Joi.string().max(56),
    });

    let body;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const unit = await Unit.findByPk(id);

    if (!unit) {
      return res.status(404).json({ error: 'Specified unit was not found' });
    }

    try {
      const updated = await unit.update(body);
      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const unit = await Unit.findByPk(id);

    if (!unit) {
      return res.status(400).json({ error: 'Specified unit was not found' });
    }

    const deleted = await unit.destroy();

    return res.json({ message: 'Specified unit successful deleted' });
  }
}

export default new UnitController();
