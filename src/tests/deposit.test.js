const {
    createDeposit,
    getDepositById,
    getDepositsByUserId,
  } = require("../models/deposit.model");
  const handleResponse = require("../utils/handleResponse");
  const { getAccountById, updateAccountBalance } = require("../models/account.model");
  const { depositSchema } = require("../schema/schema");
  const validateData = require("../utils/validateData");
  const { deposit } = require("../controllers/deposit.controller");
  
  jest.mock('../models/account.model');
  jest.mock('../models/deposit.model');
  jest.mock('../utils/handleResponse');
  jest.mock('../utils/validateData');
  
  describe('Deposit Controller', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should return 400 if data validation fails', async () => {
      const req = { body: { accountId: '1', amount: 'invalid' }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: false, message: 'Invalid data' });
  
      await deposit(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Failed to create deposit, invalid data type.",
        error: 'Invalid data',
      });
    });
  
    test('should return 404 if account is not found', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue(null);
  
      await deposit(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 404, { message: "Account not found" });
    });
  
    test('should return 403 if user is not authorized to deposit', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 2 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue({ userId: 1 });
  
      await deposit(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 403, {
        message: "Unauthorized to deposit into this account",
      });
    });
  
    test('should return 201 if deposit is successful', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockResolvedValue({ userId: 1 });
      updateAccountBalance.mockResolvedValue();
      createDeposit.mockResolvedValue({ accountId: '1', amount: 100 });
  
      await deposit(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 201, {
        message: "Deposit successful",
        data: { accountId: '1', amount: 100 },
      });
    });
  
    test('should return 500 if there is an internal server error', async () => {
      const req = { body: { accountId: '1', amount: 100 }, userId: 1 };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      validateData.mockReturnValue({ isValid: true });
      getAccountById.mockRejectedValue(new Error('Database error'));
  
      await deposit(req, res);
  
      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Deposit failed",
        error: 'Database error',
      });
    });
  });
  