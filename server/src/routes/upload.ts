import express from "express";
import multer from "multer";
import imagekit from "../config/imagekit";

const router: express.Router = express.Router();

// Multer-Konfiguration mit Größenlimit und Dateityp-Filter
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Nur Bilder erlauben
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

router.post("/avatar", (req, res, next) => {
  // Debug: Lass uns sehen was ankommt
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Headers:', req.headers);
  console.log('Body keys:', Object.keys(req.body || {}));
  
  upload.single("avatar")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
          return;
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
          res.status(400).json({ error: 'Unexpected field. Use "avatar" for avatar uploads.' });
          return;
        }
        res.status(400).json({ error: `Upload error: ${error.message}` });
        return;
      }
      if (error.message === 'Only image files are allowed!') {
        res.status(400).json({ error: 'Only image files are allowed!' });
        return;
      }
      res.status(500).json({ error: 'Upload failed' });
      return;
    }
    next();
  });
}, async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    console.log('Uploading avatar:', req.file.originalname, req.file.mimetype);
    
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `avatar-${Date.now()}-${req.file.originalname}`,
      folder: "/avatars",
    });

    res.json({ 
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
      name: uploadedImage.name 
    });
    return;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ error: 'Failed to upload image to ImageKit' });
    return;
  }
});

router.post("/post-image", (req, res, next) => {
  upload.single("postimage")(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
          return;
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
          res.status(400).json({ error: 'Unexpected field. Use "postimage" for post image uploads.' });
          return;
        }
        res.status(400).json({ error: `Upload error: ${error.message}` });
        return;
      }
      if (error.message === 'Only image files are allowed!') {
        res.status(400).json({ error: 'Only image files are allowed!' });
        return;
      }
      res.status(500).json({ error: 'Upload failed' });
      return;
    }
    next();
  });
}, async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    console.log('Uploading post image:', req.file.originalname, req.file.mimetype);
    
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `post-${Date.now()}-${req.file.originalname}`,
      folder: "/posts",
    });

    res.json({ 
      url: uploadedImage.url,
      fileId: uploadedImage.fileId,
      name: uploadedImage.name 
    });
    return;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ error: 'Failed to upload image to ImageKit' });
    return;
  }
});

export default router;