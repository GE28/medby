import { promises as fs } from 'fs';
import { join } from 'path';

import Joi from '@hapi/joi';
import Doctor from '../models/Doctor';
import User from '../models/User';

class AvatarController {
  async store(req, res) {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'File not provided' });
    }

    let Entity = User;

    if (!req.userId) {
      try {
        const _validated = await Joi.string()
          .uuid()
          .validateAsync(req.params.id);
        Entity = Doctor;
      } catch (err) {
        return res.status(400).json({ error: 'You must provide a valid ID' });
      }
    }

    const id = req.userId || req.params.id;

    const entityData = await Entity.findByPk(id, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });

    if (!entityData) {
      return res.status(404).json({ error: 'The specified ID is not valid' });
    }

    const { avatar } = entityData;

    if (avatar) {
      try {
        const _deleted_file = await fs.unlink(
          join(
            __dirname,
            '../../',
            process.env.STATIC_PATH
              ? `${process.env.STATIC_PATH}/avatars/${avatar}`
              : `../uploads/avatars/${avatar}`
          )
        );
      } catch (err) {
        if (!err.code === 'ENOENT') {
          res.status(500).json({ error: 'Internal server error' });
        }
        const _deleted_file = await fs.unlink(file.path);
        const _deleted_path = await entityData.update({ avatar: null });
        return res
          .status(503)
          .json({ error: 'Internal server error. Please try again later' });
      }
    }

    const updated = await (
      await entityData.update({ avatar: file.filename })
    ).get({ plain: true });
    delete updated.password_hash;

    return res.json(updated);
  }
}

export default new AvatarController();
