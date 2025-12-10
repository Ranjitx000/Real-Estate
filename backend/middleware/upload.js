import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  // simple mime type check
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit each
});

export default upload;