import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No image uploaded' });
    }
    // Format the path universally regardless of OS
    const formattedPath = req.file.path.replace(/\\/g, '/');
    // Return the URL path
    res.send({ url: `/${formattedPath}` });
});

export default router;
