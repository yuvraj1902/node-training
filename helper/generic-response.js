module.exports = {
  sendResponse: async (req, res) => {
    console.log(res.data);
    const response = {
      statusCode: 200,
      data: res.data || {},
      message: "Success"
    }
    return res.status(200).json(response);
  },
};
