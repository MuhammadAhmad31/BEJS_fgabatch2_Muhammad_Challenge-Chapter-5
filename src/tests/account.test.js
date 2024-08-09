const { create, getAll, getById, getByUserId } = require("../controllers/account.controller");
const { createAccount, getAllAccounts, getAccountById, getAccountsByUserId } = require("../models/account.model");
const validateData = require("../utils/validateData");
const handleResponse = require("../utils/handleResponse");

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

describe("Account Controller", () => {

  describe("create", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to add account, all fields are required.",
        error: "Missing required fields: userId, bankName, bankAccountNumber, balance",
      });
    });

    it("should return 400 if data validation fails", async () => {
      const req = mockRequest({
        userId: "user1",
        bankName: "Bank",
        bankAccountNumber: "123456",
        balance: 1000,
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: false, message: "Validation error" });

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to add account, invalid data type.",
        error: "Validation error",
      });
    });

    it("should create a new account and return 201", async () => {
      const req = mockRequest({
        userId: "user1",
        bankName: "Bank",
        bankAccountNumber: "123456",
        balance: 1000,
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      createAccount.mockResolvedValue(req.body);

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 201, {
        message: "Account added successfully",
        data: req.body,
      });
    });

    it("should return 500 if createAccount throws an error", async () => {
      const req = mockRequest({
        userId: "user1",
        bankName: "Bank",
        bankAccountNumber: "123456",
        balance: 1000,
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      createAccount.mockRejectedValue(new Error("Database error"));

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Failed to add account",
        error: "Database error",
      });
    });
  });

  describe("getAll", () => {
    it("should return 200 and all accounts", async () => {
      const req = mockRequest(null, null, { page: 1, limit: 10 });
      const res = mockResponse();
      const accounts = [{ id: 1, bankName: "Bank A" }, { id: 2, bankName: "Bank B" }];
      getAllAccounts.mockResolvedValue(accounts);

      await getAll(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 200, {
        message: "Accounts retrieved successfully",
        data: accounts,
      });
    });

    it("should return 500 if getAllAccounts throws an error", async () => {
      const req = mockRequest(null, null, { page: 1, limit: 10 });
      const res = mockResponse();
      getAllAccounts.mockRejectedValue(new Error("Database error"));

      await getAll(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Failed to retrieve accounts",
        error: "Database error",
      });
    });
  });

  describe("getById", () => {
    it("should return 404 if account is not found", async () => {
      const req = mockRequest(null, { accountId: "1" });
      const res = mockResponse();
      getAccountById.mockResolvedValue(null);

      await getById(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, {
        message: "Account not found",
      });
    });

    it("should return 200 and the account if found", async () => {
      const req = mockRequest(null, { accountId: "1" });
      const res = mockResponse();
      const account = { id: 1, bankName: "Bank A" };
      getAccountById.mockResolvedValue(account);

      await getById(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 200, {
        message: "Account retrieved successfully",
        data: account,
      });
    });

    it("should return 500 if getAccountById throws an error", async () => {
      const req = mockRequest(null, { accountId: "1" });
      const res = mockResponse();
      getAccountById.mockRejectedValue(new Error("Database error"));

      await getById(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Failed to retrieve account",
        error: "Database error",
      });
    });
  });

  describe("getByUserId", () => {
    it("should return 404 if accounts are not found for the user", async () => {
      const req = mockRequest(null, { userId: "user1" });
      const res = mockResponse();
      getAccountsByUserId.mockResolvedValue([]);

      await getByUserId(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, {
        message: "Accounts not found",
      });
    });

    it("should return 200 and the accounts if found", async () => {
      const req = mockRequest(null, { userId: "user1" });
      const res = mockResponse();
      const accounts = [{ id: 1, bankName: "Bank A" }];
      getAccountsByUserId.mockResolvedValue(accounts);

      await getByUserId(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 200, {
        message: "Accounts retrieved successfully",
        data: accounts,
      });
    });

    it("should return 500 if getAccountsByUserId throws an error", async () => {
      const req = mockRequest(null, { userId: "user1" });
      const res = mockResponse();
      getAccountsByUserId.mockRejectedValue(new Error("Database error"));

      await getByUserId(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Failed to retrieve accounts",
        error: "Database error",
      });
    });
  });

});
