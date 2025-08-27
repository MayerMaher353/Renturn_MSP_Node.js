const multer = require("multer");
const { storage } = require("../config/cloudinary");

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Middleware for single image upload
const uploadSingleImage = upload.single("image");

// Middleware for multiple images upload
const uploadMultipleImages = upload.array("images", 5); // Max 5 images

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  upload,
};
