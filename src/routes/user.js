const express = require('express');

const router = express.Router();

const { editProfile, getProfileImage, updateProfilePic } = require('../controllers/user');
const { verifyUserToken } = require('../middlewares/auth');
const storage = require('multer').memoryStorage();
const upload = require('multer')({ storage });

router.route('/edit').patch(verifyUserToken, editProfile);
router.route('/profile-image/:id').get(getProfileImage).patch(verifyUserToken, upload.single('file'), updateProfilePic);

module.exports = router;
