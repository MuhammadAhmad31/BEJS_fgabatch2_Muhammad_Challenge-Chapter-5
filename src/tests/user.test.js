const { create, getAll, getById } = require("../controllers/user.controller");
const { createUser, getAllUsers, getUserById } = require("../models/user.model");
const validateData = require("../utils/validateData");
const handleResponse = require("../utils/handleResponse");

jest.mock("../models/user.model");
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

describe("User Controller", () => {

  describe("create", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Gagal menambahkan user, semua field wajib diisi.",
        error: "Missing required fields: name, email, password, profile",
      });
    });

    it("should return 400 if data validation fails", async () => {
      const req = mockRequest({
        name: "Test",
        email: "test@example.com",
        password: "123456",
        profile: "user"
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: false, message: "Validation error" });

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 400, {
        message: "Gagal menambahkan user, tipe data tidak sesuai.",
        error: "Validation error",
      });
    });

    it("should create a new user and return 201", async () => {
      const req = mockRequest({
        name: "Test",
        email: "test@example.com",
        password: "123456",
        profile: "user"
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      createUser.mockResolvedValue(req.body);

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 201, {
        message: "User berhasil ditambahkan",
        data: req.body,
      });
    });

    it("should return 500 if createUser throws an error", async () => {
      const req = mockRequest({
        name: "Test",
        email: "test@example.com",
        password: "123456",
        profile: "user"
      });
      const res = mockResponse();
      validateData.mockReturnValue({ isValid: true });
      createUser.mockRejectedValue(new Error("Database error"));

      await create(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Gagal menambahkan user",
        error: "Database error",
      });
    });
  });

  describe("getAll", () => {
    it("should return 200 and all users", async () => {
      const req = mockRequest(null, null, { page: 1, limit: 10 });
      const res = mockResponse();
      const users = [{ id: 1, name: "User1" }, { id: 2, name: "User2" }];
      getAllUsers.mockResolvedValue(users);

      await getAll(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 200, {
        message: "Users berhasil ditampilkan",
        data: users,
      });
    });

    it("should return 500 if getAllUsers throws an error", async () => {
      const req = mockRequest(null, null, { page: 1, limit: 10 });
      const res = mockResponse();
      getAllUsers.mockRejectedValue(new Error("Database error"));

      await getAll(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Gagal menampilkan users",
        error: "Database error",
      });
    });
  });

  describe("getById", () => {
    it("should return 404 if user is not found", async () => {
      const req = mockRequest(null, { userId: 1 });
      const res = mockResponse();
      getUserById.mockResolvedValue(null);

      await getById(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, {
        message: "User tidak ditemukan",
      });
    });

    it("should return 200 and the user if found", async () => {
      const req = mockRequest(null, { userId: 1 });
      const res = mockResponse();
      const user = { id: 1, name: "User1" };
      getUserById.mockResolvedValue(user);

      await getById(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 200, {
        message: "User berhasil ditampilkan",
        data: user,
      });
    });

    it("should return 500 if getUserById throws an error", async () => {
      const req = mockRequest(null, { userId: 1 });
      const res = mockResponse();
      getUserById.mockRejectedValue(new Error("Database error"));

      await getById(req, res);

      expect(handleResponse).toHaveBeenCalledWith(res, 500, {
        message: "Gagal menampilkan user",
        error: "Database error",
      });
    });
  });

});
