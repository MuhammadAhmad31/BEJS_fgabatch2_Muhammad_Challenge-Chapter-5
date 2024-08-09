const {
  createUser,
  getAllUsers,
  getUserById,
} = require("../models/user.model");
const validateData = require("../utils/validateData");
const { userSchema } = require("../schema/schema");
const handleResponse = require("../utils/handleResponse");

const create = async (req, res) => {
  const { body } = req;
  const { name, email, password, profile } = body;

  if (!name || !email || !password || !profile) {
    return handleResponse(res, 400, {
      message: "Gagal menambahkan user, semua field wajib diisi.",
      error: "Missing required fields: name, email, password, profile",
    });
  }

  const { isValid, message } = validateData(body, userSchema);

  if (!isValid) {
    return handleResponse(res, 400, {
      message: "Gagal menambahkan user, tipe data tidak sesuai.",
      error: message,
    });
  }

  try {
    const user = await createUser(body);
    handleResponse(res, 201, {
      message: "User berhasil ditambahkan",
      data: user,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Gagal menambahkan user",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await getAllUsers(parseInt(page), parseInt(limit));
    handleResponse(res, 200, {
      message: "Users berhasil ditampilkan",
      data: users,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Gagal menampilkan users",
      error: err ? err.message : "Unknown error",
    });
  }
};

const getById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);
    if (!user) {
      handleResponse(res, 404, {
        message: "User tidak ditemukan",
      });
      return;
    }
    handleResponse(res, 200, {
      message: "User berhasil ditampilkan",
      data: user,
    });
  } catch (err) {
    handleResponse(res, 500, {
      message: "Gagal menampilkan user",
      error: err ? err.message : "Unknown error",
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
};
