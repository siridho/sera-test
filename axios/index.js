const axios = require("axios");
const urlRegister = "https://reqres.in/api/register";
const bodyRegister = {
  email: "eve.holt@reqres.in",
  password: "pistol",
};

async function registerAxios() {
  axios
    .post(`${urlRegister}`, bodyRegister)
    .then((result) => {
      console.log(result.data);
      return result.data;
    })
    .catch((err) => {
      throw err;
    });
}
new Promise((resolve, reject) => {
  resolve(registerAxios());
});

const urlLogin = "https://reqres.in/api/login";
const bodyLogin = {
  email: "eve.holt@reqres.in",
  password: "cityslicka",
};

async function loginAxios() {
  axios
    .post(`${urlLogin}`, bodyLogin)
    .then((result) => {
      console.log(result.data);
      return result.data;
    })
    .catch((err) => {
      throw err;
    });
}
new Promise((resolve, reject) => {
  resolve(loginAxios());
});
