const { validatePassword, getUserByEmail } = require("../../models/user.model");
const handleResponse = require("../../utils/handleResponse");
const { generateToken } = require("../../utils/jwt");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleResponse(res, 400, {
      message: "Email and password are required",
    });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return handleResponse(res, 404, {
        message: "User not found",
      });
    }

    const isValidPassword = await validatePassword(password, user.password);

    if (!isValidPassword) {
      return handleResponse(res, 401, {
        message: "Invalid password",
      });
    }

    const token = generateToken(user);

    return handleResponse(res, 200, {
      message: "Login successful",
      data: { token },
    });
  } catch (err) {
    return handleResponse(res, 500, {
      message: "Login failed",
      error: err.message,
    });
  }
};

module.exports = { login };
