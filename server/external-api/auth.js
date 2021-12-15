const axiosApi = require("../helpers/axiosApi");
const authHeader = require("../helpers/authHeader")
const constants = require("../helpers/constant")

const AuthApi = {
  async register(data, token) {
    console.log('data', data);
    console.log('authHeader(token)', authHeader(token));

    try {
      const response = await axiosApi.post(
        '/user', 
        data, 
        {headers: authHeader(token)}
      )

      return response.userId
    }

    catch (e) {
      console.log('error', e.message);
      return false
    }
  },
};

module.exports = AuthApi;
