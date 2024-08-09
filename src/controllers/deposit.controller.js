const {
  updateAccountBalance,
  getAccountById,
} = require("../models/account.model");
const {
  createDeposit,
  getDepositById,
  getDepositsByUserId,
} = require("../models/deposit.model");
const { depositSchema } = require("../schema/schema");
const handleResponse = require("../utils/handleResponse");
const validateData = require("../utils/validateData");

const deposit = async (req, res) => {
  const { userId } = req;
  const { accountId, amount } = req.body;

  if (!accountId || !amount) {
    return handleResponse(res, 400, {
      message: "Account ID and amount are required",
    });
  }

  const { isValid, message } = validateData({ accountId, amount }, depositSchema);

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
        message: "Unauthorized to deposit into this account",
      });
    }

    await updateAccountBalance(accountId, amount);

    const deposit = await createDeposit({ accountId, amount });

    return handleResponse(res, 201, {
      message: "Deposit successful",
      data: deposit,
    });
  } catch (err) {
    return handleResponse(res, 500, {
      message: "Deposit failed",
      error: err.message,
    });
  }
};

const getById = async (req, res) => {
  const { depositId } = req.params;
  try {
    const deposit = await getDepositById(depositId);
    if (!deposit) {
      handleResponse(res, 404, { message: "Deposit not found" });
      return;
    }
    handleResponse(res, 200, {
      message: "Deposit retrieved successfully",
      data: deposit,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve deposit",
      error: err.message,
    });
  }
};

const getByUserId = async (req, res) => {
    const { userId } = req;
    try {
      const deposits = await getDepositsByUserId(userId);
      if (!deposits || deposits.length === 0) {
        handleResponse(res, 404, { message: "No deposits found for this user" });
        return;
      }
      handleResponse(res, 200, {
        message: "Deposits retrieved successfully",
        data: deposits,
      });
    } catch (err) {
      handleResponse(res, 500, {
        message: "Failed to retrieve deposits",
        error: err.message,
      });
    }
  };
  

module.exports = {
  deposit,
  getById,
  getByUserId
};
