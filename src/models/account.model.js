const prisma = require("../config/prisma");

const createAccount = async (data) => {
  const { userId, bankName, bankAccountNumber, balance } = data;

  try {
    const account = await prisma.bankAccount.create({
      data: {
        userId,
        bankName,
        bankAccountNumber,
        balance,
      },
    });
    return account;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAllAccounts = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const accounts = await prisma.bankAccount.findMany({
      skip,
      take: limit,
    });
    const totalAccounts = await prisma.bankAccount.count();
    return {
      accounts,
      totalPages: Math.ceil(totalAccounts / limit),
      currentPage: page,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAccountById = async (id) => {
  try {
    const account = await prisma.bankAccount.findUnique({
      where: {
        id,
      },
    });
    return account;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateAccountBalance = async (accountId, amount) => {
  try {
    const account = await prisma.bankAccount.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });
    return account;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAccountsByUserId = async (userId) => {
  try {
    const accounts = await prisma.bankAccount.findMany({
      where: {
        userId,
      },
    });
    return accounts;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  getAccountsByUserId,
  updateAccountBalance
};
