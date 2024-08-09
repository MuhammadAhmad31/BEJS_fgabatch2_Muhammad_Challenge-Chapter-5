const { login } = require('../controllers/auth/auth.controller');
const { getUserByEmail, validatePassword } = require('../models/user.model');
const handleResponse = require('../utils/handleResponse');
const { generateToken } = require('../utils/jwt');

jest.mock('../models/user.model');
jest.mock('../utils/handleResponse');
jest.mock('../utils/jwt');

describe('Auth Controller - login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if email or password is missing', async () => {
    const req = { body: { email: '', password: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await login(req, res);

    expect(handleResponse).toHaveBeenCalledWith(res, 400, {
      message: "Email and password are required",
    });
  });

  test('should return 404 if user is not found', async () => {
    const req = { body: { email: 'test@example.com', password: 'password' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserByEmail.mockResolvedValue(null);

    await login(req, res);

    expect(handleResponse).toHaveBeenCalledWith(res, 404, {
      message: "User not found",
    });
  });

  test('should return 401 if password is invalid', async () => {
    const req = { body: { email: 'test@example.com', password: 'password' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserByEmail.mockResolvedValue({ password: 'hashedPassword' });
    validatePassword.mockResolvedValue(false);

    await login(req, res);

    expect(handleResponse).toHaveBeenCalledWith(res, 401, {
      message: "Invalid password",
    });
  });

  test('should return 200 and token if login is successful', async () => {
    const req = { body: { email: 'test@example.com', password: 'password' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserByEmail.mockResolvedValue({ password: 'hashedPassword' });
    validatePassword.mockResolvedValue(true);
    generateToken.mockReturnValue('token');

    await login(req, res);

    expect(handleResponse).toHaveBeenCalledWith(res, 200, {
      message: "Login successful",
      data: { token: 'token' },
    });
  });

  test('should return 500 if there is an internal server error', async () => {
    const req = { body: { email: 'test@example.com', password: 'password' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    getUserByEmail.mockRejectedValue(new Error('Database error'));

    await login(req, res);

    expect(handleResponse).toHaveBeenCalledWith(res, 500, {
      message: "Login failed",
      error: 'Database error',
    });
  });
});
