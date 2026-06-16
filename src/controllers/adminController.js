const adminService = require("../services/adminService");
const violationReportService = require("../services/violationReportService");

async function listUsers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await adminService.listUsers({ page, limit });
    return res.status(200).json({ status: true, message: "OK", data: result.data, pagination: result.pagination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ status: false, message: "Field status wajib diisi", data: null });
    if (!["aktif", "nonaktif"].includes(status)) return res.status(400).json({ status: false, message: "Status hanya boleh aktif atau nonaktif", data: null });

    try {
      await adminService.updateUserStatus(id, status, req.user.id_user);
    } catch (err) {
      if (err.message === "INVALID_ID") return res.status(400).json({ status: false, message: "Parameter id harus berupa angka", data: null });
      if (err.message === "CANNOT_DISABLE_SELF") return res.status(403).json({ status: false, message: "Anda tidak dapat menonaktifkan akun Anda sendiri", data: null });
      if (err.message === "NOT_FOUND") return res.status(404).json({ status: false, message: "User tidak ditemukan", data: null });
      throw err;
    }

    return res.status(200).json({ status: true, message: "Data user diperbarui", data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    try {
      await adminService.deleteUser(id, req.user.id_user);
    } catch (err) {
      if (err.message === "INVALID_ID") return res.status(400).json({ status: false, message: "Parameter id harus berupa angka", data: null });
      if (err.message === "CANNOT_DELETE_SELF") return res.status(403).json({ status: false, message: "Anda tidak dapat menghapus akun Anda sendiri", data: null });
      if (err.message === "NOT_FOUND") return res.status(404).json({ status: false, message: "User tidak ditemukan", data: null });
      throw err;
    }

    return res.status(200).json({ status: true, message: "User berhasil dihapus", data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
  }
}

async function createParkingArea(req, res) {
  try {
    const { name_area, location, kapasitas_total } = req.body;
    if (!name_area || !location || kapasitas_total === undefined) return res.status(400).json({ status: false, message: "Field name_area, location, dan kapasitas_total wajib diisi", data: null });

    try {
      const area = await adminService.createParkingArea({ name_area, location, kapasitas_total });
      return res.status(201).json({ status: true, message: "Area parkir berhasil ditambahkan", data: { id_area: area.id_area } });
    } catch (err) {
      if (err.message === "INVALID_KAPASITAS") return res.status(400).json({ status: false, message: "kapasitas_total harus berupa angka lebih dari 0", data: null });
      if (err.message === "NAME_TAKEN") return res.status(409).json({ status: false, message: "Nama area parkir sudah digunakan", data: null });
      throw err;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
  }
}

async function updateParkingArea(req, res) {
  try {
    const { id } = req.params;
    const { name_area, location, kapasitas_total } = req.body;

    try {
      await adminService.updateParkingArea(id, { name_area, location, kapasitas_total });
    } catch (err) {
      if (err.message === "INVALID_ID") return res.status(400).json({ status: false, message: "Parameter id harus berupa angka", data: null });
      if (err.message === "NO_FIELDS") return res.status(400).json({ status: false, message: "Minimal satu field harus diisi untuk diperbarui", data: null });
      if (err.message === "INVALID_KAPASITAS") return res.status(400).json({ status: false, message: "kapasitas_total harus berupa angka lebih dari 0", data: null });
      if (err.message === "KAPASITAS_TOO_SMALL") return res.status(400).json({ status: false, message: "kapasitas_total tidak boleh lebih kecil dari jumlah kendaraan yang sedang parkir", data: null });
      if (err.message === "NOT_FOUND") return res.status(404).json({ status: false, message: "Area parkir tidak ditemukan", data: null });
      if (err.message === "NAME_TAKEN") return res.status(409).json({ status: false, message: "Nama area parkir sudah digunakan", data: null });
      throw err;
    }

    return res.status(200).json({ status: true, message: "Area parkir berhasil diperbarui", data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
  }
}

async function deleteParkingArea(req, res) {
  try {
    const { id } = req.params;
    try {
      await adminService.deleteParkingArea(id);
    } catch (err) {
      if (err.message === "INVALID_ID") return res.status(400).json({ status: false, message: "Parameter id harus berupa angka", data: null });
      if (err.message === "NOT_FOUND") return res.status(404).json({ status: false, message: "Area parkir tidak ditemukan", data: null });
      if (err.message === "AREA_NOT_EMPTY") return res.status(409).json({ status: false, message: "Area parkir tidak dapat dihapus karena masih ada kendaraan di dalamnya", data: null });
      throw err;
    }

    return res.status(200).json({ status: true, message: "Area parkir berhasil dihapus", data: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server", data: null });
  }
}

async function listViolationReportsAdmin(req, res) {
  // reuse existing service for listing; behavior same as satpam but role is admin
  return require("../controllers/violationReportController").listForSatpam(req, res);
}

async function exportViolationReportsAdmin(req, res) {
  return require("../controllers/violationReportController").exportReports(req, res);
}


module.exports = {
  listUsers,
  updateUser,
  deleteUser,
  createParkingArea,
  updateParkingArea,
  deleteParkingArea,
  listViolationReportsAdmin,
  exportViolationReportsAdmin,
};
