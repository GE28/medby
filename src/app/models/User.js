import Sequelize, { Model } from 'sequelize';
import { hash, compare } from 'bcrypt';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4(),
          primaryKey: true,
        },
        name: Sequelize.STRING(72),
        email: Sequelize.STRING,
        cpf: Sequelize.STRING(11),
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      { sequelize, tableName: 'users' }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await hash(user.password, 7);
      }
    });

    return this;
  }

  async checkPassword(password) {
    const passwordsMatch = await compare(password, this.password_hash);
    return passwordsMatch;
  }
}

export default User;
