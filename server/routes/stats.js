const router = require('express').Router();
const statsController = require("../controllers/Stats");

router.get('/professionals', statsController.getProfessionals);
router.get('/topics', statsController.getTopics);
router.get('/articles', statsController.getArticles);

module.exports = router