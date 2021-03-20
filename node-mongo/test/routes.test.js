const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

const suffixEmail =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);
let token = null;

describe("register user sucess", () => {
  it("register user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({
        email: `${suffixEmail}@test.com`,
        password: "123",
        name: "test",
      });
    expect(res.body).toHaveProperty("password");
    expect(res.body).toHaveProperty("_id");
  });
});

describe("login user success", () => {
  it("login user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: `${suffixEmail}@test.com`,
        password: "123",
      });
    token = res.body.token;
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("_id");
    expect(res.body).toHaveProperty("token");
  });
});

describe("make notes", () => {
  it("make notes", async () => {
    const res = await request(app)
      .post("/api/notes")
      .send({
        content: "test content",
        title: "title",
      })
      .set("Authorization", `Bearer ${token}`);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("content");
  });
});
