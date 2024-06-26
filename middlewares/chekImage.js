const multer = require('multer')


const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'checkImages/')
	},
	filename(req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + '-' + file.originalname)
	},
})

const types = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({ storage, fileFilter })