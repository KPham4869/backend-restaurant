var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController'); 

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/changePassword', UserController.changePassword);
router.post('/logout',UserController.logout);
router.get('/', UserController.getUser);
router.post('/refresh-token',UserController.refreshAccessToken);

// Cập nhật thông tin người dùng
router.put('/:id', UserController.updateUser);
// Xóa tài khoản người dùng
router.delete('/:id', UserController.deleteUser);

module.exports = router;