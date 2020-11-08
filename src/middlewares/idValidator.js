import Joi from '@hapi/joi';

export default async function checkId(req, res, next) {
  try {
    const validated = await Joi.string().uuid().validateAsync(req.params.id);
  } catch (err) {
    return res.status(400).json({ error: 'You must provide a valid UUID' });
  }

  return next();
}
