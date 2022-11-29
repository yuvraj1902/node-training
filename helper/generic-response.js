module.exports = {
    sendResponse: async (req, res) => {
        return res.status(req.statusCode).json(req.result);
    },
};
