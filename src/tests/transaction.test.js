const { create } = require("../controllers/transaction.controller");
const { createTransaction, getAllTransactions, getTransactionById } = require("../models/transaction.model");
const { getAccountById } = require("../models/account.model");
const validateData = require("../utils/validateData");
const handleResponse = require("../utils/handleResponse");

jest.mock("../models/transaction.model");
jest.mock("../models/account.model");
jest.mock("../utils/validateData");
jest.mock("../utils/handleResponse");

global.mockRequest = (body, params, query) => {
  return {
    body: body || {},
    params: params || {},
    query: query || {},
  };
};

global.mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("Transaction Controller", () => {
  describe("create", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to add transaction, all fields are required.",
        error: "Missing required fields: sourceAccountId, destinationAccountId, amount",
      });
    });

    it("should return 400 if source and destination accounts are the same", async () => {
      const req = mockRequest({ sourceAccountId: "1", destinationAccountId: "1", amount: 100 });
      const res = mockResponse();

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to add transaction, source and destination accounts cannot be the same.",
        error: "Source and destination account IDs must be different.",
      });
    });

    it("should return 400 if data validation fails", async () => {
      const req = mockRequest({
        sourceAccountId: "1",
        destinationAccountId: "2",
        amount: 100
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: false, message: "Validation error" });

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to add transaction, data type mismatch.",
        error: "Validation error",
      });
    });

    it("should return 404 if source account is not found", async () => {
      const req = mockRequest({
        sourceAccountId: "1",
        destinationAccountId: "2",
        amount: 100
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValueOnce(null); 
      getAccountById.mockResolvedValueOnce({ balance: 200 }); 

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, {
        message: "Source account not found",
      });
    });

    it("should return 404 if destination account is not found", async () => {
      const req = mockRequest({
        sourceAccountId: "1",
        destinationAccountId: "2",
        amount: 100
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValueOnce({ balance: 200 });
      getAccountById.mockResolvedValueOnce(null);

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, {
        message: "Destination account not found",
      });
    });

    it("should return 400 if source account has insufficient balance", async () => {
      const req = mockRequest({
        sourceAccountId: "1",
        destinationAccountId: "2",
        amount: 100
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValueOnce({ balance: 50 });
      getAccountById.mockResolvedValueOnce({});

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Insufficient balance in source account",
        error: "Insufficient balance in source account",
      });
    });

    it("should create a transaction and return 201", async () => {
      const req = mockRequest({
        sourceAccountId: "1",
        destinationAccountId: "2",
        amount: 100
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValueOnce({ balance: 200 });
      getAccountById.mockResolvedValueOnce({}); 
      createTransaction.mockResolvedValue(req.body);

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 201, {
        message: "Transaction added successfully",
        data: req.body,
      });
    });

    it("should return 500 if createTransaction throws an error", async () => {
      const req = mockRequest({
        sourceAccountId: "1",
        destinationAccountId: "2",
        amount: 100
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValueOnce({ balance: 200 });
      getAccountById.mockResolvedValueOnce({});
      createTransaction.mockRejectedValue(new Error("Database error"));

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Failed to add transaction",
        error: "Database error",
      });
    });
  });
});
