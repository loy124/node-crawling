const { sequelize, Sequelize } = require("./index");

module.exports = (sequelize, Sequelize) => {
  return sequelize.define("facebook", {
    postId: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique : true

    },
    content:{
        type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.TEXT
    },
    writer:{
        type : Sequelize.STRING(30),
        
    }
  });
};
