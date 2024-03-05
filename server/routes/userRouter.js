const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.post("/confirmEmail/:email", userCtrl.confirmEmail)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUser)
router.get('/all_infor', auth, authAdmin, userCtrl.getUsersAllInfor)

router.patch('/addcart', auth, userCtrl.addCart)

router.get('/', auth, userCtrl.getUser)
router.patch('/', auth, userCtrl.updateUserInfo)
router.get('/all', auth, authAdmin, userCtrl.getAllUsers)
router.put('/:id/role', auth, authAdmin, userCtrl.updateUserRole)
router.post('/deletemany', auth, authAdmin, userCtrl.deleteUsers)
//router.get('/history', auth, userCtrl.history)


module.exports = router