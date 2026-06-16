const violationReportService = require("../services/violationReportService");
const PDFDocument = require("pdfkit");

const createViolationReport = async (req, res) => {
    try {
        const { location, description } = req.body;

        if (!location || !description) {
            return res.status(400).json({
                status: false,
                message: "Field location dan description wajib diisi",
                data: null,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Foto pelanggaran wajib dilampirkan",
                data: null,
            });
        }

        await violationReportService.createViolationReport(req.file.filename, location, description);

        return res.status(201).json({ status: true, message: "Laporan berhasil dikirim", data: null });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
    }
};

async function listForSatpam(req, res) {
    try {
        const { page = 1, limit = 10, status } = req.query;

        if (status && !["pending", "diproses", "selesai"].includes(status)) {
            return res.status(400).json({ status: false, message: "Filter status hanya boleh: pending, diproses, atau selesai", data: null });
        }

        const pageNum = Number(page);
        const limitNum = Number(limit);
        if (Number.isNaN(pageNum) || Number.isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
            return res.status(400).json({ status: false, message: "Parameter page dan limit harus berupa angka positif", data: null });
        }

        const result = await violationReportService.listViolationReports({ page: pageNum, limit: limitNum, status });

        return res.status(200).json({ status: true, message: "OK", data: result.data, pagination: result.pagination });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
    }
}

async function updateStatus(req, res) {
    try {
        const { id } = req.params;
        const id_reports = Number(id);

        if (Number.isNaN(id_reports)) {
            return res.status(400).json({ status: false, message: "Parameter id harus berupa angka", data: null });
        }

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ status: false, message: "Field status wajib diisi", data: null });
        }

        if (!["diproses", "selesai"].includes(status)) {
            return res.status(400).json({ status: false, message: "Status hanya boleh diproses atau selesai", data: null });
        }

        try {
            await violationReportService.updateViolationReportStatus(id_reports, status);
        } catch (err) {
            if (err.message === "NOT_FOUND") {
                return res.status(404).json({ status: false, message: "Laporan tidak ditemukan", data: null });
            }
            if (err.message === "ALREADY_FINISHED") {
                return res.status(409).json({ status: false, message: "Laporan yang sudah selesai tidak dapat diubah", data: null });
            }
            if (err.message === "INVALID_STATUS") {
                return res.status(400).json({ status: false, message: "Status hanya boleh diproses atau selesai", data: null });
            }
            throw err;
        }

        return res.status(200).json({ status: true, message: "Status laporan diperbarui", data: null });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
    }
}

async function exportReports(req, res) {
    try {
        const { start_date, end_date, status } = req.query;

        if (status && !["pending", "diproses", "selesai"].includes(status)) {
            return res.status(400).json({ status: false, message: "Filter status hanya boleh: pending, diproses, atau selesai", data: null });
        }

        let reports;
        try {
            reports = await violationReportService.getReportsForExport({ start_date, end_date, status });
        } catch (err) {
            if (err.message === "INVALID_DATE") {
                return res.status(400).json({ status: false, message: "Format tanggal tidak valid, gunakan YYYY-MM-DD", data: null });
            }
            throw err;
        }

        if (!reports || reports.length === 0) {
            return res.status(404).json({ status: false, message: "Tidak ada data laporan untuk diekspor", data: null });
        }

        // Generate PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=violation_reports.pdf");

        const doc = new PDFDocument();
        doc.pipe(res);

        doc.fontSize(18).text("Laporan Pelanggaran", { align: "center" });
        doc.moveDown();

        reports.forEach((r, idx) => {
            doc.fontSize(12).text(`${idx + 1}. ID: ${r.id_reports}`);
            doc.text(`   Lokasi: ${r.location}`);
            doc.text(`   Deskripsi: ${r.description}`);
            doc.text(`   Status: ${r.status}`);
            doc.text(`   Foto: ${r.photo}`);
            doc.text(`   Dibuat: ${r.created_at.toISOString()}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Terjadi kesalahan saat membuat PDF", data: null });
    }
}

module.exports = {
    createViolationReport,
    listForSatpam,
    updateStatus,
    exportReports,
};