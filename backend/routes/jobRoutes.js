const express = require('express');
const router = express.Router();
const { getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

// every route below runs `protect` first — if it calls next(), the controller runs;
// if not, the request is rejected with 401 before it ever reaches the controller
router.get('/', protect, getJobs);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
