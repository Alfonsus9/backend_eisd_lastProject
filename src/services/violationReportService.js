const prisma = require("../config/prisma");

const createViolationReport = async (photo, location, description) => {
    return await prisma.violationReport.create({
        data: {
            photo,
            location,
            description,
            status: "pending",
        },
    });
};

async function listViolationReports({ page = 1, limit = 10, status }) {
    const where = {};
    if (status) {
        where.status = status;
    }

    const total = await prisma.violationReport.count({ where });

    const data = await prisma.violationReport.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        data,
        pagination: { page, limit, total },
    };
}

async function updateViolationReportStatus(id_reports, status) {
    const allowed = ["diproses", "selesai"];
    if (!allowed.includes(status)) {
        throw new Error("INVALID_STATUS");
    }

    const report = await prisma.violationReport.findUnique({
        where: { id_reports },
    });
    if (!report) {
        throw new Error("NOT_FOUND");
    }

    if (report.status === "selesai") {
        throw new Error("ALREADY_FINISHED");
    }

    return prisma.violationReport.update({
        where: { id_reports },
        data: { status },
    });
}

async function getReportsForExport({ start_date, end_date, status }) {
    const where = {};

    if (status) {
        where.status = status;
    }

    if (start_date) {
        const s = new Date(start_date);
        if (isNaN(s.getTime())) {
            throw new Error("INVALID_DATE");
        }
        where.created_at = { gte: s };
    }

    if (end_date) {
        const e = new Date(end_date);
        if (isNaN(e.getTime())) {
            throw new Error("INVALID_DATE");
        }
        // include entire day by setting time to end of day
        e.setHours(23, 59, 59, 999);
        where.created_at = where.created_at || {};
        where.created_at.lte = e;
    }

    return prisma.violationReport.findMany({
        where,
        orderBy: { created_at: "desc" },
    });
}

module.exports = {
    createViolationReport,
    listViolationReports,
    updateViolationReportStatus,
    getReportsForExport,
};