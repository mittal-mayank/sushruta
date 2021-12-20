const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { MulterError } = require('multer');

cloudinary.config({
    cloud_name: process.env.CLDNRY_NAME,
    api_key: process.env.CLDNRY_API_KEY,
    api_secret: process.env.CLDNRY_API_SECRET,
});

const isCloud =
    process.env.CLDNRY_NAME &&
    process.env.CLDNRY_API_KEY &&
    process.env.CLDNRY_API_SECRET;

function saveImage(fileName, folderName, localDest) {
    return multer({
        storage: isCloud
            ? new CloudinaryStorage({
                  cloudinary: cloudinary,
                  params: { folder: folderName },
              })
            : new multer.diskStorage({
                  destination: function (req, file, cb) {
                      cb(null, localDest);
                  },
              }),
        limits: { fileSize: +process.env.MAX_IMAGE_SIZE, files: 1 },
        fileFilter: (req, file, callback) => {
            if (file.mimetype.split('/').shift() !== 'image')
                return callback(new MulterError('LIMIT_UNEXPECTED_FILE'));
            callback(null, true);
        },
    }).single(fileName);
}

function uploadAvatar(req, res, next) {
    saveImage(
        'avatar',
        process.env.CLDNRY_AVATAR_FOLDER,
        './uploads/images/avatars'
    )(req, res, (err) => {
        if (err) return res.status(400).send(err);
        if (req.body.avatar) return res.sendStatus(400);
        if (req.file)
            req.body.avatar = isCloud ? req.file.path : `/${req.file.path}`;
        next();
    });
}

function uploadPrescription(req, res, next) {
    saveImage(
        'prescription',
        process.env.CLDNRY_PRESC_FOLDER,
        './uploads/images/prescriptions'
    )(req, res, (err) => {
        if (err) return res.status(400).send(err);
        if (req.body.avatar) return res.sendStatus(400);
        if (req.file)
            req.body.avatar = isCloud ? req.file.path : `/${req.file.path}`;
        next();
    });
}

module.exports = {
    uploadAvatar,
    uploadPrescription,
};
