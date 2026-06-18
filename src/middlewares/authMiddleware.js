const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function requirePetugas(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: "Token tidak ditemukan",
                data: null,
            });
        }

        const token = auth.split(" ")[1];
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).json({
                status: false,
                message: "Token tidak valid atau sesi telah berakhir",
                data: null,
            });
        }

        const user = await prisma.user.findUnique({
            where: { id_user: payload.id_user },
        });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Token tidak valid atau sesi telah berakhir",
                data: null,
            });
        }

        if (!user.status) {
            return res.status(403).json({
                status: false,
                message: "Akun Anda telah dinonaktifkan, hubungi admin",
                data: null,
            });
        }

        if (user.role !== "petugas") {
            return res.status(403).json({
                status: false,
                message: "Anda tidak memiliki akses ke halaman ini",
                data: null,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server",
            data: null,
        });
    }
}

async function requireAdmin(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: "Token tidak ditemukan",
                data: null,
            });
        }

        const token = auth.split(" ")[1];
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return res.status(401).json({
                status: false,
                message: "Token tidak valid atau sesi telah berakhir",
                data: null,
            });
        }

        const user = await prisma.user.findUnique({
            where: { id_user: payload.id_user },
        });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Token tidak valid atau sesi telah berakhir",
                data: null,
            });
        }

        if (!user.status) {
            return res.status(403).json({
                status: false,
                message: "Akun Anda telah dinonaktifkan, hubungi admin",
                data: null,
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                status: false,
                message: "Anda tidak memiliki akses ke halaman ini",
                data: null,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server",
            data: null,
        });
    }
}

module.exports = {
    requirePetugas,
    requireAdmin,
};

