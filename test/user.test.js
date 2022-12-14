const app = require("../app");
const request = require("supertest");
const models = require("../models");
const { createUser } = require("../services/user.service");
const { createRandomUser } = require("../utility/faker");
const { faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const logger = require("../utility/logger");
const redis = require("../utility/redis");
require("dotenv").config();
logger.init();
redis.connect();
describe("reset password", () => {
  const userPayload1 = createRandomUser("USR", "104");
  const adminPayload = createRandomUser("ADM", "103");
  const admin2Payload2 = createRandomUser("ADM", "103");
  let user;
  let admin1;
  let admin2;
  let payload1;
  beforeAll(async () => {
    user = await createUser(userPayload1);
    admin1 = await createUser(adminPayload);
    admin2 = await createUser(admin2Payload2);
    admin1Token = jwt.sign(
      { userId: admin1.data.id },
      process.env.SECRET_KEY_ACCESS,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    admin2Token = jwt.sign(
      { userId: admin2.data.id },
      process.env.SECRET_KEY_ACCESS,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    userToken = jwt.sign(
      { userId: user.data.id },
      process.env.SECRET_KEY_ACCESS,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    payload1 = {
      password: "Gkmit@10",
    };
  });

  payload2 = {
    password: "Gkmit@10",
  };
  afterAll(async () => {
    await models.UserRoleMapping.destroy({
      where: {},
      force: true,
    });
    await models.UserDesignationMapping.destroy({
      where: {},
      force: true,
    });
    await models.User.destroy({
      where: {},
      force: true,
    });
  });

  it("200 when password is reset successfully", async () => {
    const response = await request(app)
      .post("/api/user/reset-password")
      .send(payload1)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });
  it("401 when access token not provided", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload1);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Access denied");
  });
});

describe("reset password by admin", () => {
  const userPayload1 = createRandomUser("USR", "104");
  const adminPayload = createRandomUser("ADM", "103");
  const admin2Payload2 = createRandomUser("ADM", "103");
  let user;
  let admin1;
  let admin2;
  let payload1;
  let payload2;
  let payload3;
  let payload4;
  beforeAll(async () => {
    user = await createUser(userPayload1);
    admin1 = await createUser(adminPayload);
    admin2 = await createUser(admin2Payload2);
    admin1Token = jwt.sign(
      { userId: admin1.data.id },
      process.env.SECRET_KEY_ACCESS,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    admin2Token = jwt.sign(
      { userId: admin2.data.id },
      process.env.SECRET_KEY_ACCESS,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    userToken = jwt.sign(
      { userId: user.data.id },
      process.env.SECRET_KEY_ACCESS,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    );
    payload1 = {
      email: user.data.email,
      password: "Gkmit@10",
    };
    payload2 = {
      email: admin1.data.email,
      password: "Gkmit@10",
    };
    payload3 = {
      password: "Gkmit@10",
    };
    payload4 = {
      email: user.data.email,
    };
  });

  afterAll(async () => {
    await models.UserRoleMapping.destroy({
      where: {},
      force: true,
    });
    await models.UserDesignationMapping.destroy({
      where: {},
      force: true,
    });
    await models.User.destroy({
      where: {},
      force: true,
    });
  });

  it(" 200 when password by admin reset successfull", async () => {
    const response = await request(app)
      .post("/api/admin/reset-user-password")
      .send(payload1)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });
  it("400 when admin try to change admin password", async () => {
    const response = await request(app)
      .post("/api/admin/reset-user-password")
      .send(payload2)
      .set("Authorization", "Bearer " + admin2Token);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Cannot reset admin password");
  });
  it("401 when access token not provided", async () => {
    const response = await request(app)
      .post("/api/admin/reset-user-password")
      .send(payload1);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Access denied");
  });
  it("403 when you are not admin", async () => {
    const response = await request(app)
      .post("/api/admin/reset-user-password")
      .send(payload1)
      .set("Authorization", "Bearer " + userToken);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
  it("422 when email is not provided", async () => {
    const response = await request(app)
      .post("/api/admin/reset-user-password")
      .send(payload3)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('"email" is required');
  });
  it("422 when password is not provided", async () => {
    const response = await request(app)
      .post("/api/admin/reset-user-password")
      .send(payload4)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('"password" is required');
  });
});
