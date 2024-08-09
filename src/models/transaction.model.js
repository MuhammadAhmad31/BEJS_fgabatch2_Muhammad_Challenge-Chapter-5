const prisma = require("../config/prisma");

const createTransaction = async ({ sourceAccountId, destinationAccountId, amount }) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    await prisma.bankAccount.update({
      where: { id: sourceAccountId },
      data: { balance: { decrement: amount } },
    });

    await prisma.bankAccount.update({
      where: { id: destinationAccountId },
      data: { balance: { increment: amount } },
    });

    const transaction = await prisma.transaction.create({
      data: {
        sourceAccountId,
        destinationAccountId,
        amount,
      },
      include: {
        sourceAccount: true,
        destAccount: true,
      },
    });

    return transaction;
  });

  return transaction;
};

const getAllTransactions = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const transactions = await prisma.transaction.findMany({
      skip,
      take: limit,
      include: {
        sourceAccount: true,
        destAccount: true,
      },
    });
    const totalTransactions = await prisma.transaction.count();
    return {
      transactions,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: page,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getTransactionById = async (id) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        sourceAccount: true,
        destAccount: true,
      },
    });
    return transaction;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
};
