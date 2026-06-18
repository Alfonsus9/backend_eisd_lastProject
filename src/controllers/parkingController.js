const {
    getAllParkingAreas,
    getParkingAreaById,
} = require("../services/parkingService");

async function fetchAllParkingAreas(req, res) {
    try {
        const data = await getAllParkingAreas();

        return res.status(200).json({
            status: true,
            message: "Berhasil mengambil data area parkir",
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server",
            data: null,
        });
    }
}

async function fetchParkingAreaById(req, res) {
    try {
        const { id } = req.params;
        const id_area = Number(id);

        if (Number.isNaN(id_area)) {
            return res.status(400).json({
                status: false,
                message: "Parameter id harus berupa angka",
                data: null,
            });
        }

        const data = await getParkingAreaById(id_area);
        if (!data) {
            return res.status(404).json({
                status: false,
                message: "Area parkir tidak ditemukan",
                data: null,
            });
        }

        return res.status(200).json({
            status: true,
            message: "Berhasil mengambil data area parkir",
            data,
        });
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
    fetchAllParkingAreas,
    fetchParkingAreaById,
};
