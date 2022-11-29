module.exports = {
  sendResponse: async (req, res) => {
    console.log(req);
    return res.status(req.statusCode).json(req.result);
  },
};
