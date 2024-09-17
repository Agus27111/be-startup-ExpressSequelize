const db = require ("../utils/db.connection");
const { Sequelize } = require ("sequelize");
const moment = require ("moment");

const User = db.define(
  "User",
  {
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role:{
      type: Sequelize.ENUM("admin", "user"),
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    expireTime: {
      type: Sequelize.DATE,
      set(value) {
        if (value !== null) {
          this.setDataValue("expireTime", moment(value).add(1, "hours"));
        } else {
          this.setDataValue("expireTime", null);
        }
      },
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

module.exports = User;
