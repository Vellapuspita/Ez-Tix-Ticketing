const express = require("express");
const {
 register,
 registerAdmin,
 login,
 loginAdmin,
 resetPassword, // Sekarang digunakan untuk Change Password
 resetPasswordSimple,
 getProfile,
 updateProfile,
 updateProfilePicture
} = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// CATATAN: Middleware 'upload' DIHAPUS karena Anda tidak ingin fitur ubah foto.
// Jika Anda ingin menggunakannya di route lain, biarkan import ini.
// const upload = require("../middleware/uploadMiddleware"); 

const router = express.Router();

// =========================================================
// A. PUBLIC ROUTES (TIDAK BUTUH LOGIN)
// =========================================================
router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);

// RESET PASSWORD SIMPLE (PUBLIC)
router.post("/reset-password-simple", resetPasswordSimple);

router.post("/admin/login", loginAdmin);

// CATATAN PENTING:
// Route ini sekarang digunakan untuk Change Password saat user SUDAH login.
// Oleh karena itu, ia harus dipindahkan ke Protected Routes.

// =========================================================
// B. PROTECTED ROUTES (MEMBUTUHKAN TOKEN JWT)
// =========================================================

// GET PROFILE
// Mengambil data profil user yang sedang login
router.get("/profile", authMiddleware, getProfile);

// UPDATE PROFILE (Hanya Nama/Data JSON)
// Fungsi upload.single("profilePicture") DIHAPUS dari sini.
router.put(
 "/profile",
 authMiddleware,
 updateProfile // Hanya memproses data JSON (nama)
);

router.put(
  "/profile/picture",
  authMiddleware,
  upload.single("profilePicture"),
  updateProfilePicture
);


// CHANGE PASSWORD (Menggantikan fungsi reset password publik)
// Memungkinkan user yang sudah login mengubah passwordnya sendiri
router.post("/reset-password", authMiddleware, resetPassword); 


module.exports = router;