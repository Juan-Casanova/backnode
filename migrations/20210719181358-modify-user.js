'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    })

    await queryInterface.changeColumn('users', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue:true
    })
  }
}; 