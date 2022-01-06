const axiosApi = require("../helpers/axiosApi");
const authHeader = require("../helpers/authHeader")

const AuthApi = {

  async getUser(userId, token) {
    try {
      const response = await axiosApi.get(
        `/user/${userId}`,
        {headers: authHeader(token)}
      )
      return response
    }
    catch (e) {
      console.log('error external-getUser', e.message);
      return false
    }
  },

  async createUser(data, token) {
    try {
      console.log('data', data);
      const response = await axiosApi.post(
        '/user', 
        data, 
        {headers: authHeader(token)}
      )
      return response.userId
    } 
    catch (e) {
      console.log('error external-createUser', e.message);
      return false
    }
  },

  async updateUser(userId, data, token) {
    try {
      const response = await axiosApi.put(
        `/user/${userId}`, 
        data, 
        {headers: authHeader(token)}
      )
      return response.userId
    } 
    catch (e) {
      console.log('error external-createUser', e.message);
      return false
    }
  },

  async deleteUser(userId, token) {
    try {
      const response = await axiosApi.delete(
        `/user/${userId}`,
        {headers: authHeader(token)}
      )
      return response
    }
    catch (e) {
      console.log('error external-deleteUser', e.message);
    }
  }
};

module.exports = AuthApi;
