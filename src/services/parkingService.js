const prisma = require("../config/prisma");

async function getActiveVehicleCountsByArea() {
    const counts = await prisma.logParkirLog.groupBy({
        by: ["id_area"],
        where: { waktu_keluar: null },
        _count: { id_log: true },
    });

    return counts.reduce((acc, item) => {
        acc[item.id_area] = item._count.id_log;
        return acc;
    }, {});
}

async function getAllParkingAreas() {
    const areas = await prisma.areaParkir.findMany();
    const activeCounts = await getActiveVehicleCountsByArea();

    return areas.map((area) => {
        const kendaraan_masuk = activeCounts[area.id_area] ?? 0;
        return {
            id_area: area.id_area,
            name_area: area.name_area,
            location: area.location,
            kapasitas_total: area.kapasitas_total,
            kendaraan_masuk,
            slot_tersedia: Math.max(area.kapasitas_total - kendaraan_masuk, 0),
            created_at: area.created_at,
            updated_at: area.updated_at,
        };
    });
}

async function getParkingAreaById(id_area) {
    const area = await prisma.areaParkir.findUnique({
        where: { id_area },
    });

    if (!area) {
        return null;
    }

    const kendaraan_masuk = await prisma.logParkirLog.count({
        where: {
            id_area,
            waktu_keluar: null,
        },
    });

    return {
        id_area: area.id_area,
        name_area: area.name_area,
        location: area.location,
        kapasitas_total: area.kapasitas_total,
        kendaraan_masuk,
        slot_tersedia: Math.max(area.kapasitas_total - kendaraan_masuk, 0),
        created_at: area.created_at,
        updated_at: area.updated_at,
    };
}

module.exports = {
    getAllParkingAreas,
    getParkingAreaById,
};
