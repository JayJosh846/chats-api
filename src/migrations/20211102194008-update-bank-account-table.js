'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameTable('Accounts', 'BankAccounts');
    await queryInterface.changeColumn('BankAccounts', 'account_number', {
      type: Sequelize.STRING,
      length: 20,
      allowNull: false
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameTable('BankAccounts', 'Accounts');
    await queryInterface.changeColumn('BankAccounts', 'account_number', {
      type: Sequelize.INTEGER
    });
  }
};
