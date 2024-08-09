const {
  createAccount,
  getAllAccounts,
  getAccountById,
} = require("../models/account.model");
const validateData = require("../utils/validateData");
const { accountSchema } = require("../schema/schema");
const handleResponse = require("../utils/handleResponse");
const { getAccountsByUserId } = require("../models/account.model");

const create = async (req, res) => {
  const { body } = req;
  const { userId, bankName, bankAccountNumber, balance } = body;

  if (!userId || !bankName || !bankAccountNumber || balance === undefined) {
    return handleResponse(res, 400, {
      message: "Failed to add account, all fields are required.",
      error: "Missing required fields: userId, bankName, bankAccountNumber, balance",
    });
  }

  const { isValid, message } = validateData(body, accountSchema);

  if (!isValid) {
    return handleResponse(res, 400, {
      message: "Failed to add account, invalid data type.",
      error: message,
    });
  }

  try {
    const account = await createAccount(body);
    handleResponse(res, 201, {
      message: "Account added successfully",
      data: account,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to add account",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const accounts = await getAllAccounts(parseInt(page), parseInt(limit));
    handleResponse(res, 200, {
      message: "Accounts retrieved successfully",
      data: accounts,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve accounts",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getById = async (req, res) => {
  const { accountId } = req.params;
  try {
    const account = await getAccountById(accountId);
    if (!account) {
      handleResponse(res, 404, {
        message: "Account not found",
      });
      return;
    }
    handleResponse(res, 200, {
      message: "Account retrieved successfully",
      data: account,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve account",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const accounts = await getAccountsByUserId(userId);
    if (!accounts.length) {
      handleResponse(res, 404, {
        message: "Accounts not found",
      });
      return;
    }
    handleResponse(res, 200, {
      message: "Accounts retrieved successfully",
      data: accounts,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve accounts",
      error: err ? err.message : "Unknown error",
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByUserId,
};
