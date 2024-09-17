const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userController = require('../controllers/user.controller');
const {uploadImage} = require('../controllers/image.controller');
const {upload} = require('../middleware/multer');



router.post('/signup', userController.createUser);
router.post('/signin', userController.loginUser);
router.get('/activate/:id', userController.setActivateUser);

router.post('/upload',auth, upload.single('image'), uploadImage);

module.exports = router;
