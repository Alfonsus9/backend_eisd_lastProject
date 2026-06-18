const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SALT_ROUNDS = 10;

async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function generateToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not set");
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
}

async function findUserByNip(nip) {
    return prisma.user.findUnique({
        where: {
            nip,
        },
    });
}

async function createUser(data) {
    return prisma.user.create({
        data,
    });
}

async function registerUser({
    name,
    nip,
    password,
    role,
}) {
    const existingUsername = await prisma.user.findUnique({
        where: {
            username: name,
        },
    });

    if (existingUsername) {
        throw new Error("USERNAME_ALREADY_EXISTS");
    }

    const existingUser = await findUserByNip(nip);

    if (existingUser) {
        throw new Error("NIP_ALREADY_EXISTS");
    }

    const hashedPassword = await hashPassword(password);

    return createUser({
        username: name,
        nip,
        password: hashedPassword,
        role
    });
}

async function loginUser({
    nip,
    password,
}) {
    const user = await findUserByNip(nip);

    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isMatch = await comparePassword(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }

    if (!user.status) {
        throw new Error("ACCOUNT_DISABLED");
    }

    const token = generateToken({
        id_user: user.id_user
    });

    return {
        user,
        token,
    };
}

module.exports = {
    registerUser,
    loginUser,
};