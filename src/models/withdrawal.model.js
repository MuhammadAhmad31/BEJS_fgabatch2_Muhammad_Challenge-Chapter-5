const prisma = require("../config/prisma");

const createWithdrawal = async ({ accountId, amount }) => {
  const withdrawal = await prisma.withdrawal.create({
    data: {
      accountId,
      amount,
    },
  });
  return withdrawal;
};

const getWithdrawalByUserId = async (userId) => {
  const withdrawal = await prisma.withdrawal.findMany({
    where: {
      account: {
        userId,
      },
    },
    include: {
      account: true,
    },
  });
  return withdrawal;
};


const getWithdrawalById = async (id) => {
  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id },
    include: {
      account: true,
    },
  });
  return withdrawal;
};

module.exports = {
  createWithdrawal,
  getWithdrawalById,
  getWithdrawalByUserId 
};
