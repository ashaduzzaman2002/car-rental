import multer from "multer"

// Define a storage strategy for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        const userId = req.userId
        const index = file.originalname.lastIndexOf('.')
        const ext = file.originalname.slice(index)

        const filename = userId + ext

        console.log(filename)
        cb(null, filename);
    }
})

export const upload = multer({ storage });

export const checkImageUpload = (req, res, next) => {

    if (!req.file) {
        return res.status(400).json({ error: true, message: 'No file uploaded' });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid file type. Only images (jpeg, png, gif) are allowed.',
        });
    }

    next();
};
