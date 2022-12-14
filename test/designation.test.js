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
describe("assign desgination", () => {
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
  let payload5;
  let payload6;
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
      userId: user.data.id,
      designationCode: 102,
    };
    payload2 = {
      userId: user.data.id,
      designationCode: 105,
    };
    payload3 = {
      userId: faker.datatype.uuid(),
      designationCode: 101,
    };
    payload4 = {
      userId: admin2.data.id,
      designationCode: 102,
    };
    payload5 = {
      userId: user.data.id,
    };
    payload6 = {
      designationCode: 103,
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

  it("200 when designation is assigned  successfull by admin", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload1)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });

  it("400 when user is not found in Database", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload2)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Designation!");
  });
  it("tests /api/admin/assign-designation  suessfull", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload3)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User Not Found!");
  });
  it("401 when token is not sent", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload2);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Access denied");
  });
  it("403 when assign designation request is not raised by admin", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload2)
      .set("Authorization", "Bearer " + userToken);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
  it("401 when admin try to change admin designation", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload4)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Access denied!");
  });
  it("422 when desginationCode is not provided", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload5)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('"designationCode" is required');
  });
  it("422 when userId is not provided", async () => {
    const response = await request(app)
      .post("/api/admin/assign-designation")
      .send(payload6)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(422);
    expect(response.body.message).toBe('"userId" is required');
  });
});

describe("deactivateDesignation", () => {
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
  let payload5;
  let payload6;
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
      userId: user.data.id,
      designationCode: 104,
    };
    payload2 = {
      userId: user.data.id,
      designationCode: 105,
    };
    payload3 = {
      userId: faker.datatype.uuid(),
      designationCode: 101,
    };
      payload4 = {
        userId: admin2.data.id,
        designationCode:103
      };
    payload5 = {
      userId: user.data.id,
    };
    payload6 = {
      designationCode: 103,
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

  it("200 when designation is deactivated by admin successfully", async () => {
    const response = await request(app)
      .delete("/api/admin/deactivate-designation")
      .send(payload1)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Success");
  });
  it("400 when requested designation is invaild", async () => {
    const response = await request(app)
      .delete("/api/admin/deactivate-designation")
      .send(payload2)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid Designation!");
  });
  it("400 when user is not found", async () => {
    const response = await request(app)
      .delete("/api/admin/deactivate-designation")
      .send(payload3)
      .set("Authorization", "Bearer " + admin1Token);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User Not Found!");
  });
  it("401 when token is not provided", async () => {
    const response = await request(app)
      .delete("/api/admin/deactivate-designation")
      .send(payload1);
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Access denied");
  });
  it("403 when requsted user is not admin", async () => {
    const response = await request(app)
      .delete("/api/admin/deactivate-designation")
      .send(payload1)
      .set("Authorization", "Bearer " + userToken);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });
    it("401 when admin try to deactivate admin designation", async () => {
      const response = await request(app)
        .delete("/api/admin/deactivate-designation")
        .send(payload4)
          .set("Authorization", "Bearer " + admin1Token);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Access denied!");
    });
    it("422 when designationCodeis not provided", async () => {
      const response = await request(app)
        .delete("/api/admin/deactivate-designation")
        .send(payload5)
        .set("Authorization", "Bearer " + admin1Token);
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toBe('\"designationCode" is required');
    });
    it("422 when userId is not provided", async () => {
      const response = await request(app)
        .delete("/api/admin/deactivate-designation")
        .send(payload6)
        .set("Authorization", "Bearer " + admin1Token);
      expect(response.statusCode).toBe(422);
      expect(response.body.message).toBe("\"userId\" is required");
    });
});
