import fs from 'fs';
import path from 'path';

import Sequelize from 'sequelize';

import config from '../../config/sequelize';

const basename = path.basename(__filename);

const models = [];

function isValidModel(file) {
  return file.slice(-3) === '.js' && file !== basename;
}

fs.readdirSync(__dirname)
  .filter((file) => isValidModel(file))
  .forEach(async (file) => {
    const model = require(path.join(__dirname, file));
    models.push(model);
  });

class Connection {
  constructor() {
    this.sequelize = new Sequelize(config);

    models
      .map((Model) => Model.default.init(this.sequelize))
      .map(
        (Model) => Model.associate && Model.associate(this.sequelize.models)
      );
  }
}

export default new Connection();
