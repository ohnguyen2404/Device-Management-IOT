const {StatusCodes, getReasonPhrase} = require('http-status-codes')

module.exports = {
  // Auth test
  allAccess(req, res) {
    res.status(StatusCodes.OK).send("Public content")
  },

  userBoard(req, res) {
    res.status(StatusCodes.OK).send("User content")
  },

  adminBoard(req, res) {
    res.status(StatusCodes.OK).send("Admin content")
  },

};
