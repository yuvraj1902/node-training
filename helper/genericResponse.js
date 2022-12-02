module.exports = {
  sendResponse: async (req, res) => {
    return res.status(200).json(res.data);
  },
};
