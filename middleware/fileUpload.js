import multer from "multer"

// Define a storage strategy for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {

        console.log(file)
        let { documentName } = req.body

        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            const message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return cb(new Error(message), null);
        }
        const userId = req.userId
        const index = file.originalname.lastIndexOf('.')
        const ext = file.originalname.slice(index)
        let filename = ''
        if (documentName) {
            filename = userId + documentName + ext
        } else {
            filename = userId + ext

        }

        console.log(filename)
        cb(null, filename);
    }
})

// handle file upload error
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: true, message: err.message });
    } else if (err) {
        res.status(400).json({ error: true, message: err.message });
    } else {
        next();
    }
};

export const upload = multer({ storage });
