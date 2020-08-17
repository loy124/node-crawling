const { sequelize, Sequelize } = require("./index");

module.exports = (sequelize, Sequelize) => {
  return sequelize.define("proxy", {
    ip: {
      type: Sequelize.STRING(30),
      allowNull: false 
    },
    type: {
      type: Sequelize.STRING(30)
    },
    latency:{
        type : Sequelize.FLOAT.UNSIGNED,
        allowNull : false
    }
  });
};
