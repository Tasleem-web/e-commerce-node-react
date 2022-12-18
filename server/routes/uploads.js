const router = require('express').Router();
const cloudinary = require('cloudinary');
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');

// Upload configuration on cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

router.post('/upload', (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ message: "No files were uploaded." });

        const file = req.files.file;

        if (file.size > (1024 * 1024)) { // 1024 * 1024 * 1 = 1mb or 1024 * 1024 * 5 = 5mb, 
            removeTmp(file.tempFilePath);
            return res.status(400).json({ message: "Size is too large." });
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ message: "Incorrect file format." });
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'test' }, async (err, result) => {
            console.log(err);
            if (err) throw err;
            removeTmp(file.tempFilePath);
            return res.json({ public_id: result.public_id, url: result.secure_url })
        })


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.post('/destroy', (req, res) => {
    try {

        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ message: "No images selected" });

        cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
            if (err) throw err;
            return res.status(200).json({ message: "Deleted Image" })
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

module.exports = router;