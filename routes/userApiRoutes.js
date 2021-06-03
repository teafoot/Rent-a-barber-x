const express = require('express');
const router = express.Router();
const multer = require('multer');

const userController = require('../controller/userController');
const joiSchemaValidation = require('../middleware/joiSchemaValidation');
const tokenValidation = require('../middleware/tokenValidation')
const userSchema = require('../apiSchema/userSchema');

router.post('/signup', joiSchemaValidation.validateBody(userSchema.signup), userController.signup);
router.post('/login', joiSchemaValidation.validateBody(userSchema.login), userController.login);

const multerOptions = {
    dest: 'public/uploads/profile-pictures',
    limits: { 
        fileSize: 1000000 // 1000KB
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Not a valid file type'));
            // cb(null, false);
        }
    }
}
const upload = multer(multerOptions);
router.post('/profile', upload.single('profile_image_upload'), tokenValidation.validateToken, joiSchemaValidation.validateBody(userSchema.profile), userController.uploadProfilePicture, userController.saveProfile);

module.exports = router;
