const router = require('express').Router()
const topicCtrl = require('../controllers/topicCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/topics')
    .get(topicCtrl.getTopics)
    .post(auth, authAdmin, topicCtrl.createTopic)

router.route('/topics/:id')
    .delete(auth, authAdmin, topicCtrl.deleteTopic)
    .put(auth, authAdmin, topicCtrl.updateTopic)

module.exports = router