const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../utils/crypto");

const createUser = async (data) => {
  const { name, email, password, profile } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  let encryptedIdentityNumber;
  try {
    encryptedIdentityNumber = encrypt(profile.identityNumber);
  } catch (error) {
    console.error("Error encrypting identity number:", error.message);
    throw new Error("Failed to encrypt identity number");
  }

  const transaction = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            ...profile,
            identityNumber: encryptedIdentityNumber,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    return user;
  });

  return transaction;
};

const getAllUsers = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        profile: true,
      },
    });
    users.forEach((user) => {
      if (user.profile && user.profile.identityNumber) {
        user.profile.identityNumber = decrypt(user.profile.identityNumber);
      }
    });
    const totalUsers = await prisma.user.count();
    return {
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        profile: true,
      },
    });
    if (user && user.profile && user.profile.identityNumber) {
      user.profile.identityNumber = decrypt(user.profile.identityNumber);
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

const validatePassword = async (inputPassword, storedPassword) => {
  return bcrypt.compare(inputPassword, storedPassword);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  validatePassword,
};
