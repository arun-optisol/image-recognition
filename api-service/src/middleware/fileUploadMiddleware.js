const multer = require('multer')
const { deleteFile } = require('../utils/util')
const upload = multer({ dest: '/tmp' }) // /tmp is the only place available to store data in lambda

const fileUploadLimit = (maxFileUploads) => {
    return (req, res, next) => {
        upload.array('files')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if(req.files && req.files.length) req.files.forEach((file) => deleteFile(file.path))
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).send('Too many files uploaded.')
                }
            } else if (req.files.length > maxFileUploads) {
                if(req.files && req.files.length) req.files.forEach((file) => deleteFile(file.path))
                return res
                    .status(400)
                    .send(`Maximum ${maxFileUploads} files allowed.`)
            }
            next()
        })
    }
}

exports.fileUploadLimit = fileUploadLimit