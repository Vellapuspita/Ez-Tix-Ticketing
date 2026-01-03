const Ticket = require("../models/Ticket");

// SCAN & CHECK-IN (admin) - GLOBAL (tanpa eventId)
exports.scanTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ message: "ticketId wajib dikirim" });
    }

    const ticket = await Ticket.findById(ticketId).populate(
      "event",
      "_id namaEvent tanggal waktu lokasi"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Tiket tidak ditemukan atau QR tidak valid" });
    }

    if (ticket.statusCheckIn) {
      return res.status(400).json({
        message: "Tiket sudah pernah digunakan untuk check-in",
        status: "SUDAH_CHECKIN",
        data: {
          ticketId: ticket._id,
          email: ticket.emailPemesan,
          jumlah: ticket.jumlah,
          eventId: ticket.event?._id,
          event: ticket.event,
          checkInTime: ticket.checkInAt,
        },
      });
    }

    ticket.statusCheckIn = true;
    ticket.checkInAt = new Date();
    await ticket.save();

    return res.json({
      message: "Check-in berhasil",
      status: "CHECKIN_BERHASIL",
      data: {
        ticketId: ticket._id,
        email: ticket.emailPemesan,
        jumlah: ticket.jumlah,
        eventId: ticket.event?._id,
        event: ticket.event,
        checkInTime: ticket.checkInAt,
      },
    });
  } catch (err) {
    console.error("Error scanTicket:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

// LIST CHECK-IN PER EVENT (admin) - tetap
exports.getCheckinListByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = { event: eventId, statusCheckIn: true };

    if (search) {
      query.$or = [
        { emailPemesan: { $regex: search, $options: "i" } },
        { _id: search },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Ticket.find(query)
        .sort({ checkInAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select("_id emailPemesan jumlah checkInAt"),
      Ticket.countDocuments(query),
    ]);

    return res.json({
      total,
      page: pageNum,
      limit: limitNum,
      data: items.map((t) => ({
        ticketId: t._id,
        email: t.emailPemesan,
        jumlah: t.jumlah,
        checkInTime: t.checkInAt,
        status: "Check-in Berhasil",
      })),
    });
  } catch (err) {
    console.error("Error getCheckinListByEvent:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};
