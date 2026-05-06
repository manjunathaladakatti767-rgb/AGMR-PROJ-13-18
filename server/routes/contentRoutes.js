const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const AuditLog = require('../models/AuditLog');
const protect = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const logAudit = async (contentId, action, performedBy, previousValue, newValue) => {
  await AuditLog.create({ contentId, action, performedBy, previousValue, newValue });
};

// @route   GET /api/content
// @desc    Get all content entries (supports ?status= & ?search=)
router.get('/', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { deleted: false };
    
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const content = await Content.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/content
// @desc    Create new entry
router.post('/', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const { title, type, body } = req.body;
    const content = await Content.create({
      title,
      type,
      body,
      createdBy: req.user._id,
      status: 'Pending'
    });

    await logAudit(content._id, 'CREATED', req.user._id, null, { title, type });
    res.status(201).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/content/:id
// @desc    Edit title/body/type
router.patch('/:id', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const { title, type, body } = req.body;
    const content = await Content.findById(req.params.id);
    
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    
    const previousValue = { title: content.title, type: content.type, body: content.body };
    
    if (title) content.title = title;
    if (type) content.type = type;
    if (body) content.body = body;
    
    await content.save();
    
    await logAudit(content._id, 'UPDATED', req.user._id, previousValue, { title: content.title, type: content.type, body: content.body });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/content/:id
// @desc    Soft delete entry
router.delete('/:id', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    content.deleted = true;
    await content.save();

    await logAudit(content._id, 'DELETED', req.user._id, { deleted: false }, { deleted: true });
    res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/content/:id/status
// @desc    Set status to approved or rejected
router.patch('/:id/status', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    const previousValue = { status: content.status };
    content.status = status;
    await content.save();

    await logAudit(content._id, 'STATUS_CHANGED', req.user._id, previousValue, { status });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/content/audit/log
// @desc    Get audit log entries
router.get('/audit/log', protect, requireRole('superuser', 'superadmin'), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email')
      .populate('contentId', 'title type')
      .sort({ timestamp: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
