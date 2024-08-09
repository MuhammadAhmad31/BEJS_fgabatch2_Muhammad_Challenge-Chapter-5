const {
  createWithdrawal,
  getWithdrawalById,
  getWithdrawalByUserId,
} = require("../models/withdrawal.model");
const handleResponse = require("../utils/handleResponse");
const { getAccountById, updateAccountBalance } = require("../models/account.model");
const { withdrawSchema } = require("../schema/schema");
const validateData = require("../utils/validateData");

const withdraw = async (req, res) => {
  const { userId } = req;
  const { accountId, amount } = req.body;

  if (!accountId || !amount) {
    return handleResponse(res, 400, {
      message: "Account ID and amount are required",
    });
  }

  const { isValid, message } = validateData({ accountId, amount }, withdrawSchema);

  if (!isValid) {
    return handleResponse(res, 400, {
      message: "Failed to create deposit, invalid data type.",
      error: message,
    });
  }

  try {
    const account = await getAccountById(accountId);

    if (!account) {
      return handleResponse(res, 404, { message: "Account not found" });
    }

    if (account.userId !== userId) {
      return handleResponse(res, 403, {
        message: "Unauthorized to withdraw from this account",
      });
    }

    if (account.balance < amount) {
      return handleResponse(res, 400, { message: "Insufficient balance" });
    }

    await updateAccountBalance(accountId, -amount);

    const withdrawal = await createWithdrawal({ accountId, amount });

    return handleResponse(res, 201, {
      message: "Withdrawal successful",
      data: withdrawal,
    });
  } catch (err) {
    return handleResponse(res, 500, {
      message: "Withdrawal failed",
      error: err.message,
    });
  }
};

const getById = async (req, res) => {
  const { withdrawalId } = req.params;
  try {
    const withdrawal = await getWithdrawalById(withdrawalId);
    if (!withdrawal) {
      handleResponse(res, 404, { message: "Withdrawal not found" });
      return;
    }
    handleResponse(res, 200, {
      message: "Withdrawal retrieved successfully",
      data: withdrawal,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve withdrawal",
      error: err.message,
    });
  }
};

const getByUserId = async (req, res) => {
    const { userId } = req;
    try {
      const withdrawal = await getWithdrawalByUserId(userId);
      if (!withdrawal || withdrawal.length === 0) {
        handleResponse(res, 404, { message: "No withdrawal found for this user" });
        return;
      }
      handleResponse(res, 200, {
        message: "Withdrawal retrieved successfully",
        data: withdrawal,
      });
    } catch (err) {
      handleResponse(res, 500, {
        message: "Failed to retrieve deposits",
        error: err.message,
      });
    }
  };

module.exports = { 
    withdraw, 
    getById,
    getByUserId,
};
