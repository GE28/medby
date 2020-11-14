import Joi from '@hapi/joi';
import Doctor from '../models/Doctor';
import Unit from '../models/Unit';
import Specialty from '../models/Specialty';

class DoctorController {
  async index(req, res) {
    const page = Math.round(req.query.page) || 1;

    const doctorList = await Doctor.findAll({
      offset: page * 10 - 10,
      limit: 10,
      include: [
        {
          model: Unit,
          as: 'unit',
          attributes: ['name'],
        },
        {
          model: Specialty,
          as: 'specialty',
          attributes: ['display_name'],
        },
      ],
    });

    return res.json(doctorList);
  }

  async show(req, res) {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: Unit,
          as: 'unit',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
        {
          model: Specialty,
          as: 'specialty',
          attributes: {
            exclude: ['created_at', 'updated_at'],
          },
        },
      ],
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Specified doctor was not found' });
    }

    return res.json(doctor);
  }

  async store(req, res) {
    const schema = Joi.object({
      name: Joi.string().max(72),
      document: Joi.string().min(10).max(13),
      spec_id: Joi.string().uuid(),
      unit_id: Joi.string().uuid(),
    }).options({ presence: 'required' });

    let body, id;

    try {
      body = await schema.validateAsync(req.body);
    } catch (err) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { document } = body;

    try {
      const doctorUnit = await Unit.findByPk(body.unit_id);

      if (!doctorUnit) {
        return res.status(404).json({ error: 'Specified unit was not found' });
      }

      const doctorSpec = await Specialty.findByPk(body.spec_id);

      if (!doctorSpec) {
        return res
          .status(404)
          .json({ error: 'Specified specialty was not found' });
      }

      const created = await Doctor.create(body);

      id = created.id;
    } catch (err) {
      if (err.fields) {
        if (err.fields.document)
          return res
            .status(409)
            .json({ error: 'Doctor with same document found' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.json({ id, ...body });
  }

  async delete(req, res) {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);

    if (!doctor) {
      return res.status(400).json({ error: 'Specified doctor was not found' });
    }

    const deleted = await doctor.destroy();

    return res.json({ message: 'Specified doctor successful deleted' });
  }
}

export default new DoctorController();
