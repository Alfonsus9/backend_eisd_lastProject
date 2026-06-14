const violationReportService = require(
    "../services/violationReportService"
);

const createViolationReport = async (
    req,
    res
) => {
    try {
        const { location, description } =
            req.body;

        if (!location || !description) {
            return res.status(400).json({
                status: false,
                message:
                    "Field location dan description wajib diisi",
                data: null,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message:
                    "Foto pelanggaran wajib dilampirkan",
                data: null,
            });
        }

        await violationReportService.createViolationReport(
            req.file.filename,
            location,
            description
        );

        return res.status(201).json({
            status: true,
            message: "Laporan berhasil dikirim",
            data: null,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: false,
            message:
                "Terjadi kesalahan pada server",
            data: null,
        });
    }
};

module.exports = {
    createViolationReport,
};