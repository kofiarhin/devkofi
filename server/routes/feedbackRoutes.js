const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.post('/', feedbackController.create);
router.get('/export', auth, requireAdmin, feedbackController.exportCsv);

module.exports = router;
