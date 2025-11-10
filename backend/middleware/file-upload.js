const multer = require('multer');
// const uuid = require('uuid/v1')  this is not working, that's why i'm using Math.random() method for randomId generation.


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, 'upload/images')
        },
        filename: (req, file, cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null, uuid() + '.' + ext)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mine type!')
        cb(error, isValid);
    }
});

module.exports = fileUpload;    