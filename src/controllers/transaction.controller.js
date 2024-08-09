const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} = require("../models/transaction.model");
const validateData = require("../utils/validateData");
const { transactionSchema } = require("../schema/schema");
const handleResponse = require("../utils/handleResponse");
const { getAccountById } = require("../models/account.model");

const create = async (req, res) => {
  const { body } = req;
  const { sourceAccountId, destinationAccountId, amount } = body;

  if (!sourceAccountId || !destinationAccountId || !amount) {
    return handleResponse(res, 400, {
      message: "Failed to add transaction, all fields are required.",
      error: "Missing required fields: sourceAccountId, destinationAccountId, amount",
    });
  }

  if (sourceAccountId === destinationAccountId) {
    return handleResponse(res, 400, {
      message: "Failed to add transaction, source and destination accounts cannot be the same.",
      error: "Source and destination account IDs must be different.",
    });
  }

  const { isValid, message } = validateData(body, transactionSchema);

  if (!isValid) {
    return handleResponse(res, 400, {
      message: "Failed to add transaction, data type mismatch.",
      error: message,
    });
  }

  try {
    const sourceAccount = await getAccountById(sourceAccountId);
    const destinationAccount = await getAccountById(destinationAccountId);

    if (!sourceAccount) {
      return handleResponse(res, 404, {
        message: "Source account not found",
      });
    }

    if (!destinationAccount) {
      return handleResponse(res, 404, {
        message: "Destination account not found",
      });
    }

    if (sourceAccount.balance < amount) {
      return handleResponse(res, 400, {
        message: "Insufficient balance in source account",
        error: "Insufficient balance in source account",
      });
    }

    const transaction = await createTransaction({ sourceAccountId, destinationAccountId, amount });
    handleResponse(res, 201, {
      message: "Transaction added successfully",
      data: transaction,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to add transaction",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const transactions = await getAllTransactions(parseInt(page), parseInt(limit));
    handleResponse(res, 200, {
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve transactions",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getById = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction) {
      handleResponse(res, 404, {
        message: "Transaction not found",
      });
      return;
    }
    handleResponse(res, 200, {
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Failed to retrieve transaction",
      error: err ? err.message : "Unknown error",
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
};
