const {userConst} = require('../constants');
const {Transaction, Sequelize, Wallet, User} = require('../models');
const {Op} = require('sequelize');

class TransactionService {
  static async findOrgnaisationTransactions(
    OrganisationId,
    extraClause = null,
  ) {
    return Transaction.findAll({
      where: {
        ...extraClause,
        OrganisationId,
      },
      attributes: ['reference','amount', 'status', 'transaction_type', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Wallet,
          as: 'ReceiverWallet',
          attributes: [],
          include: [
            {
              model: User,
              as: 'User',
              attributes: userConst.publicAttr,
              attributes: []
            },
          ],
        },
        {
          model: Wallet,
          as: 'SenderWallet',
          attributes: [],
          include: [
            {
              model: User,
              as: 'User',
              attributes: userConst.publicAttr,
              attributes: []
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  static async findTransaction(where) {
    return Transaction.findOne({
      where,
      include: [
        {
          model: Wallet,
          as: 'ReceiverWallet',
          attributes: [],
          include: [
            {
              model: User,
              as: 'User',
              attributes: userConst.publicAttr,
            },
          ],
        },
        {
          model: Wallet,
          as: 'SenderWallet',
          attributes: [],
          include: [
            {
              model: User,
              as: 'User',
              attributes: userConst.publicAttr,
            },
          ],
        },
      ],
    });
  }

  static async getTotalTransactionAmount(where = {}) {
    return Transaction.findAll({
      where,
      attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
      raw: true,
    });
  }

  static async getTotalTransactionAmountAdmin(OrganisationId) {
    return Transaction.findAll({
      where: {
        OrganisationId,
        transaction_type: 'transfer',
      },
    });
  }

  static async getBeneficiaryTotalTransactionAmountAdmin(BeneficiaryId) {
    return Transaction.findAll({
      where: {
        BeneficiaryId,
        transaction_type: 'spent',
      },
    });
  }


  static async getAllTransactions() {
    try {
      return await Transaction.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async addTransaction(newTransaction) {
    try {
      // return Transfer.processTransfer(userId, element.UserId, element.amount);
      return await Transaction.create(newTransaction);
    } catch (error) {
      throw error;
    }
  }

  static async updateTransaction(id, updateTransaction) {
    try {
      const TransactionToUpdate = await Transaction.findOne({
        where: {
          id: Number(id),
        },
      });

      if (TransactionToUpdate) {
        await Transaction.update(updateTransaction, {
          where: {
            id: Number(id),
          },
        });

        return updateTransaction;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
  transaction_type;

  static async getATransaction(id) {
    try {
      const theTransaction = await Transaction.findOne({
        where: {
          id: Number(id),
        },
      });

      return theTransaction;
    } catch (error) {
      throw error;
    }
  }

  static async getUserATransaction(id) {
    try {
      const theTransaction = await Transaction.findOne({
        where: {
          [Op.or]: [
            {
              BeneficiaryId: id,
              VendorId: id,
            },
          ],
        },
      });

      return theTransaction;
    } catch (error) {
      throw error;
    }
  }
  static async deleteTransaction(id) {
    try {
      const TransactionToDelete = await Transaction.findOne({
        where: {
          id: Number(id),
        },
      });

      if (TransactionToDelete) {
        const deletedTransaction = await Transaction.destroy({
          where: {
            id: Number(id),
          },
        });
        return deletedTransaction;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TransactionService;
