const prisma = require("../config/prisma");

const createViolationReport = async (
    photo,
    location,
    description
) => {
    return await prisma.violationReport.create({
        data: {
            photo,
            location,
            description,
            status: "pending"
        },
    });
};

module.exports = {
    createViolationReport,
};