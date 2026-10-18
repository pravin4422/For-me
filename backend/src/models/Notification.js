const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true, index: true },
    type:      { type: String, default: 'reminder' },
    category:  { type: String, default: 'Task' },
    title:     { type: String, required: true },
    body:      { type: String, default: '' },
    taskId:    { type: String, default: null },
    read:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
