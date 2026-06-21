const Job = require('../models/Job');

// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    // critical line: only fetch jobs belonging to the logged-in user
    const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const { companyName, role, salary, location, applicationLink, applicationDate, status, notes, interviewDate } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ message: 'Company name and role are required' });
    }

    const job = await Job.create({
      userId: req.userId, // tie the job to whoever is logged in — never trust a userId from the request body
      companyName,
      role,
      salary,
      location,
      applicationLink,
      applicationDate,
      status,
      notes,
      interviewDate,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // ownership check — this is the line that stops User A from editing User B's job
    // even though they're both authenticated, only the owner is authorized
    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document, not the old one
      runValidators: true, // re-run schema validation (e.g. status enum) on update
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ message: 'Job deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };
