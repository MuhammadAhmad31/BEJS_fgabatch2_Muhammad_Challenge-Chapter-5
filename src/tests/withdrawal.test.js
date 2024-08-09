const {
    createWithdrawal,
    getWithdrawalById,
    getWithdrawalsByUserId,
  } = require("../models/withdrawal.model");
  const handleResponse = require("../utils/handleResponse");
  const { getAccountById, updateAccountBalance } = require("../models/account.model");
  const { withdrawalSchema } = require("../schema/schema");
  const validateData = require("../utils/validateData");
  const { withdraw } = require("../controllers/withdrawal.controller");
  
  jest.mock('../models/account.model');
  jest.mock('../models/withdrawal.model');
  jest.mock('../utils/handleResponse');
  jest.mock('../utils/validateData');
  
  describe('Withdrawal Controller', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should return 400 if data validation fails', async () => {
      const req = { body: { accountId: '1', amount: 'invalid' }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: false, message: 'Invalid data' });
  
      await withdraw(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to create withdrawal, invalid data type.",
        error: 'Invalid data',
      });
    });
  
    test('should return 404 if account is not found', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue(null);
  
      await withdraw(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 404, { message: "Account not found" });
    });
  
    test('should return 403 if user is not authorized to withdraw', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 2 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue({ userId: 1 });
  
      await withdraw(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 403, {
        message: "Unauthorized to withdraw from this account",
      });
    });
  
    test('should return 400 if there is insufficient balance', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue({ userId: 1, balance: 50 });
  
      await withdraw(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Insufficient balance",
      });
    });
  
    test('should return 201 if withdrawal is successful', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue({ userId: 1, balance: 200 });
      updateAccountBalance.mockResolvedValue();
      createWithdrawal.mockResolvedValue({ accountId: '1', amount: 100 });
  
      await withdraw(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 201, {
        message: "Withdrawal successful",
        data: { accountId: '1', amount: 100 },
      });
    });
  
    test('should return 500 if there is an internal server error', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockRejectedValue(new Error('Database error'));
  
      await withdraw(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Withdrawal failed",
        error: 'Database error',
      });
    });
  });
  