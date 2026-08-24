const healthCheck = (req, res) => {
  res.json({ success: true, status: 200, message: 'Server is running' });
};

module.exports = { healthCheck };
