const express = require('express');
const progressController = require('../controllers/progressController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, progressController.get);
router.post('/', auth, progressController.update);

module.exports = router;
