const prisma = require("../config/prisma");

async function listUsers({ page = 1, limit = 10 } = {}) {
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await prisma.user.count();
    const users = await prisma.user.findMany({
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { created_at: "desc" },
    });

    const data = users.map((u) => ({
        id_user: u.id_user,
        name: u.username,
        nip: u.nip,
        role: u.role,
        status: u.status ? "aktif" : "nonaktif",
        created_at: u.created_at,
    }));

    return {
        data,
        pagination: { page: pageNum, limit: limitNum, total },
    };
}

async function updateUserStatus(id_user, status, currentUserId) {
    const id = Number(id_user);
    if (Number.isNaN(id)) {
        throw new Error("INVALID_ID");
    }

    if (!["aktif", "nonaktif"].includes(status)) {
        throw new Error("INVALID_STATUS");
    }

    if (id === currentUserId && status === "nonaktif") {
        throw new Error("CANNOT_DISABLE_SELF");
    }

    const user = await prisma.user.findUnique({ where: { id_user: id } });
    if (!user) {
        throw new Error("NOT_FOUND");
    }

    return prisma.user.update({
        where: { id_user: id },
        data: { status: status === "aktif" },
    });
}

async function deleteUser(id_user, currentUserId) {
    const id = Number(id_user);
    if (Number.isNaN(id)) {
        throw new Error("INVALID_ID");
    }

    if (id === currentUserId) {
        throw new Error("CANNOT_DELETE_SELF");
    }

    const user = await prisma.user.findUnique({ where: { id_user: id } });
    if (!user) {
        throw new Error("NOT_FOUND");
    }

    return prisma.user.delete({ where: { id_user: id } });
}

async function createParkingArea({ name_area, location, kapasitas_total }) {
    if (!name_area || !location || kapasitas_total === undefined) {
        throw new Error("MISSING_FIELDS");
    }
    const kapasitas = Number(kapasitas_total);
    if (Number.isNaN(kapasitas) || kapasitas <= 0) {
        throw new Error("INVALID_KAPASITAS");
    }

    const exists = await prisma.areaParkir.findFirst({ where: { name_area } });
    if (exists) {
        throw new Error("NAME_TAKEN");
    }

    const area = await prisma.areaParkir.create({
        data: { name_area, location, kapasitas_total: kapasitas },
    });
    return area;
}

async function updateParkingArea(
    id_area,
    { name_area, location, kapasitas_total }
) {
    const id = Number(id_area);
    if (Number.isNaN(id)) {
        throw new Error("INVALID_ID");
    }

    const area = await prisma.areaParkir.findUnique({ where: { id_area: id } });
    if (!area) {
        throw new Error("NOT_FOUND");
    }

    if (
        !name_area &&
        !location &&
        (kapasitas_total === undefined || kapasitas_total === null)
    ) {
        throw new Error("NO_FIELDS");
    }

    if (name_area) {
        const other = await prisma.areaParkir.findFirst({
            where: { name_area, NOT: { id_area: id } },
        });
        if (other) {
            throw new Error("NAME_TAKEN");
        }
    }

    if (kapasitas_total !== undefined && kapasitas_total !== null) {
        const kapasitas = Number(kapasitas_total);
        if (Number.isNaN(kapasitas) || kapasitas <= 0) {
            throw new Error("INVALID_KAPASITAS");
        }

        const activeCount = await prisma.logParkirLog.count({
            where: { id_area: id, waktu_keluar: null },
        });
        if (kapasitas < activeCount) {
            throw new Error("KAPASITAS_TOO_SMALL");
        }
    }

    return prisma.areaParkir.update({
        where: { id_area: id },
        data: { name_area, location, kapasitas_total },
    });
}

async function deleteParkingArea(id_area) {
    const id = Number(id_area);
    if (Number.isNaN(id)) {
        throw new Error("INVALID_ID");
    }

    const area = await prisma.areaParkir.findUnique({ where: { id_area: id } });
    if (!area) {
        throw new Error("NOT_FOUND");
    }

    const activeCount = await prisma.logParkirLog.count({
        where: { id_area: id, waktu_keluar: null },
    });
    if (activeCount > 0) {
        throw new Error("AREA_NOT_EMPTY");
    }

    return prisma.areaParkir.delete({ where: { id_area: id } });
}

module.exports = {
    listUsers,
    updateUserStatus,
    deleteUser,
    createParkingArea,
    updateParkingArea,
    deleteParkingArea,
};
