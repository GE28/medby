import fs from 'fs';
import path from 'path';

import Sequelize from 'sequelize';

import config from '../../config/sequelize';

// This file's name
const basename = path.basename(__filename);

const models = [];

// file's extension = "js"
// file ≠ this file
function isValidModel(file) {
  return file.slice(-3) === '.js' && file !== basename;
}

// Get all the .js files in this directory
fs.readdirSync(__dirname)
  .filter((file) => isValidModel(file))
  .forEach(async (file) => {
    // Import file
    const model = require(path.join(__dirname, file));
    models.push(model);
  });

class Connection {
  constructor() {
    this.sequelize = new Sequelize(config);

    // Importing models into sequelize
    models
      .map((Model) => Model.default.init(this.sequelize))
      .map(
        (Model) => Model.associate && Model.associate(this.sequelize.models)
      );
  }
}

export default new Connection();
