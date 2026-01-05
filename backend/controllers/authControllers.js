const bcrypt = require("bcrypt");
const User = require("../models/User"); // Asumsi User model memiliki field 'namaPengguna' dan 'kataSandi'
const jwt = require("jsonwebtoken");

// ===============================================================
// 1. REGISTER USER (Public)
// ===============================================================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check email sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = new User({
      namaPengguna: name,
      email,
      kataSandi: hashedPassword,
      role: "user",
    });

    await newUser.save();

    // Kirim response TANPA TOKEN
    res.status(201).json({
      message: "Registrasi user berhasil",
      user: {
        id: newUser._id,
        namaPengguna: newUser.namaPengguna,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.error("🔴 Error Register:", err);
    res.status(500).json({
      message: "Terjadi kesalahan server saat registrasi.",
      error: err.message,
    });
  }
};


// ===============================================================
// 2. REGISTER ADMIN (Public)
// ===============================================================
const registerAdmin = async (req, res) => {
  try {
    const { name, namaPengguna, email, password, kataSandi } = req.body || {};

    if (!req.body) {
      return res.status(400).json({
        message: "Request body kosong. Pastikan Content-Type application/json",
      });
    }

    const finalName = name || namaPengguna;
    const finalPassword = password || kataSandi;

    if (!finalName || !email || !finalPassword) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const newAdmin = new User({
      namaPengguna: finalName,
      email,
      kataSandi: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    return res.status(201).json({
      message: "Registrasi admin berhasil",
      user: {
        id: newAdmin._id,
        namaPengguna: newAdmin.namaPengguna,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    console.error("🔴 Fatal Error during Admin Registration:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat registrasi admin.",
      error: err.message,
    });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, kataSandi } = req.body;

    if (!email || !kataSandi) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(kataSandi, user.kataSandi);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password salah" });
    }

    // ✅ khusus admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Akun ini bukan admin." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({
      message: "Login admin berhasil",
      token,
      user: {
        id: user._id,
        namaPengguna: user.namaPengguna,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("🔴 Fatal Error during Admin Login:", err);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server saat login admin.", error: err.message });
  }
};


// ===============================================================
// 3. LOGIN USER (Public)  -> KHUSUS role "user"
// ===============================================================
const login = async (req, res) => {
  try {
    const { email, kataSandi } = req.body;

    if (!email || !kataSandi) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(kataSandi, user.kataSandi);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Password salah" });
    }

    // 🔐 KUNCI UTAMA: BLOK ADMIN
    if (user.role !== "user") {
      return res.status(403).json({
        message: "Akun admin tidak bisa login di halaman user.",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user._id,
        namaPengguna: user.namaPengguna,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null,
      },
    });
  } catch (err) {
    console.error("🔴 Fatal Error during Login:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat login.",
      error: err.message,
    });
  }
};



// ===============================================================
// 4. CHANGE PASSWORD (Protected)
// Endpoint: /reset-password (POST)
// ===============================================================
const resetPassword = async (req, res) => {
    try {
        // Menggunakan ID dari token JWT
        const userId = req.user.id; 
        
        // Ambil input password baru
        const { kataSandiBaru, ulangiKataSandiBaru } = req.body; 

        // 1. Validasi input
        if (!kataSandiBaru || !ulangiKataSandiBaru) {
            return res.status(400).json({ message: "Kata sandi baru wajib diisi" });
        }
        if (kataSandiBaru !== ulangiKataSandiBaru) {
            return res.status(400).json({ message: "Kata sandi baru tidak sama" });
        }

        // 2. Cari user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // 3. Hash dan simpan password baru
        const hashedPassword = await bcrypt.hash(kataSandiBaru, 10);
        user.kataSandi = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Kata sandi berhasil diubah" });

    } catch (err) {
        console.error("Error change password:", err);
        return res.status(500).json({ message: "Terjadi kesalahan server saat ubah kata sandi.", error: err.message });
    }
};

const resetPasswordSimple = async (req, res) => {
  try {
    const { email, kataSandiBaru } = req.body;

    if (!email || !kataSandiBaru) {
      return res.status(400).json({
        message: "Email dan kata sandi baru wajib diisi",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email tidak ditemukan",
      });
    }

    // ⛔ blok admin reset lewat user flow
    if (user.role !== "user") {
      return res.status(403).json({
        message: "Akun ini tidak diizinkan reset lewat halaman user",
      });
    }

    const hashedPassword = await bcrypt.hash(kataSandiBaru, 10);
    user.kataSandi = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Kata sandi berhasil direset",
    });
  } catch (err) {
    console.error("Error resetPasswordSimple:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan server saat reset kata sandi",
      error: err.message,
    });
  }
};

// ===============================================================
// 5. GET PROFILE (Protected)
// Endpoint: /profile (GET)
// ===============================================================
const getProfile = async (req, res) => {
    try {
        // req.user.id berasal dari token JWT
        const user = await User.findById(req.user.id).select("-kataSandi");
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        res.json({ message: "Profil user", user });
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
    }
};

// ===============================================================
// 6. UPDATE PROFILE (Protected)
// Endpoint: /profile (PUT)
// ===============================================================
const updateProfile = async (req, res) => {
    try {
        // Hanya izinkan user biasa
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Admin tidak bisa mengubah profil di endpoint ini" });
        }

        const { name } = req.body; 
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Update nama jika dikirim
        if (name) {
            user.namaPengguna = name; 
        }

        // Hapus logika file/foto karena tidak dibutuhkan
        
        await user.save();

        res.json({
            message: "Profil berhasil diperbarui",
            user: {
                id: user._id,
                namaPengguna: user.namaPengguna,
                email: user.email,
                profilePicture: user.profilePicture || null, 
            },
        });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Terjadi kesalahan server saat update profile.", error: err.message });
    }
};

const updateProfilePicture = async (req, res) => {
  try {
    // token jwt sudah inject req.user.id dari authMiddleware
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (!req.file) {
      return res.status(400).json({ message: "File foto tidak ditemukan" });
    }

    // simpan path file ke DB
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    return res.json({
      message: "Foto profil berhasil diperbarui",
      user: {
        id: user._id,
        namaPengguna: user.namaPengguna,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Terjadi kesalahan server saat update foto profil.",
      error: err.message,
    });
  }
};


module.exports = { register, registerAdmin, login, loginAdmin, resetPassword, resetPasswordSimple, getProfile, updateProfile, updateProfilePicture };