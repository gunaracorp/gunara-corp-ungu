import path from "path";

/** Direktori penyimpanan berkas unggahan (di luar public/ agar akses terkontrol). */
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
