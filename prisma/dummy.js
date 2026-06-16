// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // ── 1. Users ───────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        username: "admin_utama",
        nip: "198001012010011001",
        password: hashedPassword,
        role: "admin",
        status: true,
      },
      {
        username: "petugas_andi",
        nip: "199203152015031002",
        password: "alfonsus123",
        role: "petugas",
        status: true,
      },
      {
        username: "petugas_budi",
        nip: "199507202018071003",
        password: hashedPassword,
        role: "petugas",
        status: true,
      },
      {
        username: "petugas_citra",
        nip: "199812012020121004",
        password: hashedPassword,
        role: "petugas",
        status: false,
      },
    ],
    skipDuplicates: true,
  });

  // ── 2. Area Parkir ─────────────────────────────────────────────────────────
  await prisma.areaParkir.createMany({
    data: [
      { name_area: "Parkir A", location: "Gedung Utama",     kapasitas_total: 100 },
      { name_area: "Parkir B", location: "Gedung Serbaguna", kapasitas_total: 80  },
      { name_area: "Parkir C", location: "Gedung Annex",     kapasitas_total: 60  },
      { name_area: "Parkir D", location: "Basement Lt. 1",   kapasitas_total: 120 },
    ],
    skipDuplicates: true,
  });

  const areas = await prisma.areaParkir.findMany();

  // ── 3. Log Parkir ──────────────────────────────────────────────────────────
  const minsAgo  = (m) => new Date(Date.now() - m * 60 * 1000);
  const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000);

  const logData = [
    // Parkir A — 3 masuk, 2 sudah keluar
    { id_area: areas[0].id_area, jenis_kendaraan: "mobil", waktu_masuk: hoursAgo(3), waktu_keluar: hoursAgo(1)  },
    { id_area: areas[0].id_area, jenis_kendaraan: "motor", waktu_masuk: hoursAgo(2), waktu_keluar: minsAgo(30)  },
    { id_area: areas[0].id_area, jenis_kendaraan: "mobil", waktu_masuk: minsAgo(45), waktu_keluar: null         },
    { id_area: areas[0].id_area, jenis_kendaraan: "motor", waktu_masuk: minsAgo(20), waktu_keluar: null         },
    { id_area: areas[0].id_area, jenis_kendaraan: "motor", waktu_masuk: minsAgo(10), waktu_keluar: null         },

    // Parkir B — 2 masuk, 1 sudah keluar
    { id_area: areas[1].id_area, jenis_kendaraan: "mobil", waktu_masuk: hoursAgo(5), waktu_keluar: hoursAgo(3)  },
    { id_area: areas[1].id_area, jenis_kendaraan: "motor", waktu_masuk: hoursAgo(1), waktu_keluar: null         },
    { id_area: areas[1].id_area, jenis_kendaraan: "mobil", waktu_masuk: minsAgo(50), waktu_keluar: null         },

    // Parkir C — semua masih di dalam
    { id_area: areas[2].id_area, jenis_kendaraan: "motor", waktu_masuk: hoursAgo(4), waktu_keluar: null         },
    { id_area: areas[2].id_area, jenis_kendaraan: "mobil", waktu_masuk: hoursAgo(2), waktu_keluar: null         },

    // Parkir D — 4 masuk, 2 sudah keluar
    { id_area: areas[3].id_area, jenis_kendaraan: "motor", waktu_masuk: hoursAgo(6), waktu_keluar: hoursAgo(4)  },
    { id_area: areas[3].id_area, jenis_kendaraan: "mobil", waktu_masuk: hoursAgo(4), waktu_keluar: hoursAgo(2)  },
    { id_area: areas[3].id_area, jenis_kendaraan: "motor", waktu_masuk: hoursAgo(2), waktu_keluar: null         },
    { id_area: areas[3].id_area, jenis_kendaraan: "mobil", waktu_masuk: minsAgo(90), waktu_keluar: null         },
    { id_area: areas[3].id_area, jenis_kendaraan: "motor", waktu_masuk: minsAgo(15), waktu_keluar: null         },
  ];

  await prisma.logParkirLog.createMany({ data: logData, skipDuplicates: true });

  console.log("✅ Seed selesai");
  console.log(`   • ${await prisma.user.count()} users`);
  console.log(`   • ${await prisma.areaParkir.count()} area parkir`);
  console.log(`   • ${await prisma.logParkirLog.count()} log parkir`);
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());