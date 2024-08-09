const prisma = require("../config/prisma");

const createDeposit = async ({ accountId, amount }) => {
  const deposit = await prisma.deposit.create({
    data: {
      accountId,
      amount,
    },
  });
  return deposit;
};

const getDepositsByUserId = async (userId) => {
  const deposits = await prisma.deposit.findMany({
    where: {
      account: {
        userId,
      },
    },
    include: {
      account: true,
    },
  });
  return deposits;
};

const getDepositById = async (id) => {
  const deposit = await prisma.deposit.findUnique({
    where: { id },
    include: {
      account: true,
    },
  });
  return deposit;
};

module.exports = {
  createDeposit,
  getDepositById,
  getDepositsByUserId,
};
