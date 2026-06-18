const {
    registerUser,
    loginUser,
} = require("../services/authService");

async function register(req, res) {
    try {
        const { name, nip, password, role } = req.body;

        if (!name || !nip || !password || !role) {
            return res.status(400).json({
                status: false,
                message: "Field name, nip, password, dan role wajib diisi",
                data: null,
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                status: false,
                message: "Password minimal 8 karakter",
                data: null,
            });
        }

        if (!["admin", "petugas"].includes(role)) {
            return res.status(400).json({
                status: false,
                message: "Role hanya boleh admin atau petugas",
                data: null,
            });
        }

        await registerUser({
            name,
            nip,
            password,
            role,
        });

        return res.status(201).json({
            status: true,
            message: "Registrasi berhasil",
            data: null,
        });
    } catch (error) {
        if (error.message === "USERNAME_ALREADY_EXISTS") {
            return res.status(409).json({
                status: false,
                message: "username sudah digunakkan",
                data: null,
            });
        }

        if (error.message === "NIP_ALREADY_EXISTS") {
            return res.status(409).json({
                status: false,
                message: "NIP sudah terdaftar",
                data: null,
            });
        }

        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server",
            data: null,
        });
    }
}

async function login(req, res) {
    try {
        const { nip, password } = req.body;

        if (!nip || !password) {
            return res.status(400).json({
                status: false,
                message: "NIP dan password wajib diisi",
                data: null,
            });
        }

        const { token } = await loginUser({
            nip,
            password,
        });

        return res.status(200).json({
            status: true,
            message: "Login berhasil",
            data: {
                token,
            },
        });
    } catch (error) {
        if (error.message === "INVALID_CREDENTIALS") {
            return res.status(401).json({
                status: false,
                message: "NIP atau password salah",
                data: null,
            });
        }

        if (error.message === "ACCOUNT_DISABLED") {
            return res.status(403).json({
                status: false,
                message: "Akun Anda telah dinonaktifkan, hubungi admin",
                data: null,
            });
        }

        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server",
            data: null,
        });
    }
}

module.exports = {
    register,
    login,
};