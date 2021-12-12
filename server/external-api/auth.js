const axiosApi = require("../helpers/axiosApi");
const constants = require("../helpers/constant");

const AuthApi = {
  register(data) {
    console.log("data", data);
    axiosApi.post('/auth/register', data).then(
      (response) => {
        console.log("response", response);
      },
      (error) => {
        console.log("error", error);
      }
    );
  },
};

module.exports = AuthApi;
