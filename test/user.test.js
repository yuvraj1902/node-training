const app = require("../app");
const request = require("supertest");
const models = require("../models");
const { faker } = require("@faker-js/faker");
const { createUser, deactivateUser, loginUser, forgetPassword } = require('../services/user.service');
const { createRandomUser } = require("../utility/faker");
const jwt = require("jsonwebtoken");
const logger = require("../utility/logger");
const redis = require("../utility/redis");
const { v4 } = require("uuid");
const UniqueStringGenerator = require('unique-string-generator');
require("dotenv").config();


logger.init();
redis.connect();



describe("user login test cases", () => {

    const responseObject = {};
    let user;
    const userPayload = createRandomUser("USR");

    const loginPayload = {
        email: userPayload.email,
        password: userPayload.password
    }

    const loginPayload1 = {
        email: userPayload.email,
        password: faker.internet.password()
    }

    const loginPayload2 = {
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
    }


    const loginPayload3 = {
        email: faker.datatype.uuid(),
        password: faker.internet.password(),
    }

    const loginPayload4 = {
        password: faker.internet.password(),
    }

    const loginPayload5 = {
        email: userPayload.email
    }

    const loginPayload6 = {

    }
    beforeAll(async () => {
        const response = await createUser(userPayload);
        user = await models.User.findOne({ where: { email: userPayload.email } });
        if (user) {
            console.log(user.dataValues.id);
            const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY_ACCESS, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION
            });
            const refreshToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY_REFRESH, {
                expiresIn: process.env.JWT_REFRESH_EXPIRATION
            });

            responseObject.id = user.dataValues.id;
            responseObject.email = user.dataValues.email;
            responseObject.accessToken = accessToken;
            responseObject.refreshToken = refreshToken;
        }
    });







    it("tests api/user/login login successfuly", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload);
        expect(response.statusCode).toBe(200);
        expect(jwt.verify(response.body.data.accessToken, process.env.SECRET_KEY_ACCESS).userId).toBe(user.id);
        console.log(response.body, "---------->");
    });

    it("tests api/user/login wrong password", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload1);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Wrong email or password");
    });

    it("tests api/user/login wrong email", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload2);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User Not Found!");
    });

    it("tests api/user/login invalid email", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload3);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" must be a valid email");
    });

    it("tests api/user/login no email", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload4);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" is required");
    });

    it("tests api/user/login no password", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload5);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" is required");
    });

    it("tests api/user/login no email password", async () => {
        const response = await request(app).post("/api/user/login").send(loginPayload6);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" is required");
    });
});


describe("create user test cases", () => {

    const user1 = createRandomUser("USR");
    const user2 = createRandomUser("USR");
    const user3 = createRandomUser("USR", "104");
    const user4 = createRandomUser("USR", "104");
    let reportee_id;
    let adminToken, userToken;

    beforeAll(async () => {
        const user = await createUser(user1);
        const adminUser = createRandomUser("ADM");
        const admin1 = await createUser(adminUser);
        const reportee = await createUser(user4);
        reportee_id = reportee.data.id;
        adminToken = jwt.sign({ userId: admin1.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
        userToken = jwt.sign({ userId: user.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
    });

    




    it("tests /api/admin/create-user create-user successfull", async () => {
        const response = await request(app).post("/api/admin/create-user").send(user2).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Success");
        expect(response.body.data.email).toBe(user2.email);
    });

    it("tests /api/admin/create-user create-user with user login", async () => {
        const response = await request(app).post("/api/admin/create-user").send(user1).set("Authorization", "Bearer " + userToken);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe("Access denied");
    });

    it("tests /api/admin/create-user create-user without login", async () => {
        const response = await request(app).post("/api/admin/create-user").send(user2);
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");
    });

    it("tests /api/admin/create-user create-user already exist", async () => {
        const response = await request(app).post("/api/admin/create-user").send(user1).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User already exists');
    });

    it("tests /api/admin/create-user create-user without first_name", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.first_name;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"first_name\" is required");
    });

    it("tests /api/admin/create-user create-user with empty string in first_name", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.first_name = "";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"first_name\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null value in first_name", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.first_name = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"first_name\" must be a string");
    });

    it("tests /api/admin/create-user create-user without last_name", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.last_name;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"last_name\" is required");
    });

    it("tests /api/admin/create-user create-user with empty string in last_name", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.last_name = "";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"last_name\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null value in last_name", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.last_name = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"last_name\" must be a string");
    });

    it("tests /api/admin/create-user create-user without email", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.email;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" is required");
    });

    it("tests /api/admin/create-user create-user with null email", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.email = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" must be a string");
    });

    it("tests /api/admin/create-user create-user invalid email", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.email = faker.datatype.string();
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" must be a valid email");
    });

    it("tests /api/admin/create-user create-user without password", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.password;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" is required");
    });

    it("tests /api/admin/create-user create-user with null password", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.password = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" must be a string");
    });

    it("tests /api/admin/create-user create-user with empty string password", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.password = "";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with password length 3", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.password = "abc";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" should be at least 4 characters long");
    });

    it("tests /api/admin/create-user create-user with password length 17", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.password = "abc5678901raghvar";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" should not be longer than 16 characters");
    });

    it("tests /api/admin/create-user create-user without organization", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.organization;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"organization\" is required");
    });

    it("tests /api/admin/create-user create-user with empty organization", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.organization = '';
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"organization\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null organization", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.organization = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"organization\" must be a string");
    });

    it("tests /api/admin/create-user create-user without source", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.source;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"source\" is required");
    });

    it("tests /api/admin/create-user create-user with empty source", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.source = '';
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"source\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null source", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.source = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"source\" must be a string");
    });

    it("tests /api/admin/create-user create-user without designation_code", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.designation_code;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"designation_code\" is required");
    });


    it("tests /api/admin/create-user create-user with string designation_code", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.designation_code = "";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"designation_code\" must be a number");
    });

    it("tests /api/admin/create-user create-user with invalid designation_code", async () => {
        const payload = JSON.parse(JSON.stringify(user3));
        payload.designation_code = "556";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid Designation");
    });

    it("tests /api/admin/create-user create-user without google_id", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.google_id;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"google_id\" is required");
    });

    it("tests /api/admin/create-user create-user with null google_id", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.google_id = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"google_id\" must be a string");
    });

    it("tests /api/admin/create-user create-user empty google_id", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.google_id = "";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"google_id\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user without role_key", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        delete payload.role_key;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"role_key\" is required");
    });

    it("tests /api/admin/create-user create-user empty string role_key", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.role_key = "";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"role_key\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null role_key", async () => {
        const payload = JSON.parse(JSON.stringify(user2));
        payload.role_key = null;
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"role_key\" must be a string");
    });

    it("tests /api/admin/create-user create-user with invalid role_key", async () => {
        const payload = JSON.parse(JSON.stringify(user3));
        payload.role_key = "tyu";
        const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid Role");
    });
});



describe("registerUser test cases", () => {
    const user1 = createRandomUser();

    it("tests /api/user/registration Successfull", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        const response = await request(app).post("/api/user/registration").send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.email).toBe(payload.email);
    });

    it("tests /api/user/registration of existing user", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        const response = await request(app).post("/api/user/registration").send(payload);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User already exists');
    });


    it("tests /api/admin/create-user create-user without first_name", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.first_name;
        const response = await request(app).post("/api/user/registration").send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"first_name\" is required");
    });

    it("tests /api/admin/create-user create-user with empty string in first_name", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.first_name = "";
        const response = await request(app).post("/api/user/registration").send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"first_name\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null value in first_name", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.first_name = null;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"first_name\" must be a string");
    });

    it("tests /api/admin/create-user create-user without last_name", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.last_name;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"last_name\" is required");
    });

    it("tests /api/admin/create-user create-user with empty string in last_name", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.last_name = "";
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"last_name\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null value in last_name", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.last_name = null;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"last_name\" must be a string");
    });

    it("tests /api/admin/create-user create-user without email", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.email;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" is required");
    });

    it("tests /api/admin/create-user create-user with null email", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.email = null;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" must be a string");
    });

    it("tests /api/admin/create-user create-user invalid email", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.email = faker.datatype.string();
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"email\" must be a valid email");
    });

    it("tests /api/admin/create-user create-user without password", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.password;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" is required");
    });

    it("tests /api/admin/create-user create-user with null password", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.password = null;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" must be a string");
    });

    it("tests /api/admin/create-user create-user with empty string password", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.password = "";
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with password length 3", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.password = "abc";
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" should be at least 4 characters long");
    });

    it("tests /api/admin/create-user create-user with password length 17", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.password = "abc5678901raghvar";
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"password\" should not be longer than 16 characters");
    });

    it("tests /api/admin/create-user create-user without organization", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.organization;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"organization\" is required");
    });

    it("tests /api/admin/create-user create-user with empty organization", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.organization = '';
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"organization\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null organization", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.organization = null;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"organization\" must be a string");
    });

    it("tests /api/admin/create-user create-user without source", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.source;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"source\" is required");
    });

    it("tests /api/admin/create-user create-user with empty source", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.source = '';
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"source\" is not allowed to be empty");
    });

    it("tests /api/admin/create-user create-user with null source", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.source = null;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"source\" must be a string");
    });

    it("tests /api/admin/create-user create-user without google_id", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        delete payload.google_id;
        const response = await request(app).post("/api/user/registration").send(payload);

        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"google_id\" is required");
    });

    it("tests /api/admin/create-user create-user without google_id", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.google_id = null;
        const response = await request(app).post("/api/user/registration").send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"google_id\" must be a string");
    });

    it("tests /api/admin/create-user create-user without google_id", async () => {
        const payload = JSON.parse(JSON.stringify(user1));
        delete payload.role_key;
        delete payload.designation_code;
        payload.google_id = "";
        const response = await request(app).post("/api/user/registration").send(payload);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"google_id\" is not allowed to be empty");
    });
});

describe("refreshToken test cases", () => {

    const user1 = createRandomUser("USR", "102");
    let accessToken, refreshToken;
    beforeAll(async () => {
        const userResponse = await createUser(user1);
        const loginResponse = await loginUser({ email: user1.email, password: user1.password });
        accessToken = loginResponse.accessToken;
        refreshToken = loginResponse.refreshToken;
    });



    it("tests /api/user/refresh-token successfull", async () => {
        const response = await request(app).get("/api/user/refresh-token").set("Authorization", "Bearer " + refreshToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.refreshToken).toBe(refreshToken);
    });

    it("tests /api/user/refresh-token without refresh token", async () => {
        const response = await request(app).get("/api/user/refresh-token");
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Access denied');
    });

    it("tests /api/user/refresh-token wrong refresh token", async () => {
        const response = await request(app).get("/api/user/refresh-token").set("Authorization", "Bearer " + faker.datatype.string());
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Login Required');
    });
});

describe("user-details test cases", () => {
    const user1 = createRandomUser("USR", "102");
    let accessToken, refreshToken;
    beforeAll(async () => {
        const userResponse = await createUser(user1);
        const loginResponse = await loginUser({ email: user1.email, password: user1.password });
        accessToken = loginResponse.accessToken;
        refreshToken = loginResponse.refreshToken;

    })

    


    it("tests /api/user/user-details successfull", async () => {
        const response = await request(app).get("/api/user/user-details").set("Authorization", "Bearer " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.email).toBe(user1.email);
    });

    it("tests /api/user/user-details without login", async () => {
        const response = await request(app).get("/api/user/user-details");
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");
    });


    it("tests /api/user/user-details invalid jwt", async () => {
        const response = await request(app).get("/api/user/user-details").set("Authorization", "Bearer " + faker.datatype.string());
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('jwt malformed');
    });
});



describe("admin get all user test cases", () => {


    const adminPayload = createRandomUser("ADM", 101);
    const managerPayload = createRandomUser("USR", 102);
    const userPayload = createRandomUser("USR", 104);


    const reporteePayload = {}
    let adminToken;

    beforeAll(async () => {

        const adminResponse = await createUser(adminPayload);
        const managerResponse = await createUser(managerPayload);
        const userResponse = await createUser(userPayload);

        reporteePayload.managerId = managerResponse.data.id;
        reporteePayload.reporteeId = userResponse.data.id;

        const admin = await models.User.findOne({ where: { email: adminPayload.email } });

        if (admin) {
            console.log(admin.dataValues.id);
            adminToken = jwt.sign({ userId: admin.id }, process.env.SECRET_KEY_ACCESS, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION
            });
        }
    });

    


    it("tests api/admin/user get all users successfully ", async () => {
        const response = await request(app).get("/api/admin/users?page=1").set("Authorization", "Bearer " + adminToken);;
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Success");
    });

    it("tests api/admin/user get all users without admin login ", async () => {
        const response = await request(app).get("/api/admin/users?page=1").set("Authorization", "Bearer " + '');;
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");
    });

    it("tests api/admin/user get all users without pagination ", async () => {
        const response = await request(app).get("/api/admin/users").set("Authorization", "Bearer " + adminToken);;
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("column \"nan\" does not exist");
    });

});


describe("delete user", () => {
    let userPayload = createRandomUser("USR");
    let userData = createRandomUser("USR");
    let adminToken, notAdminToken, user, notAdmin, adminUser, admin, admin2;

    beforeAll(async () => {
        user = await createUser(userData);
        notAdmin = await createUser(userPayload);
        adminUser = createRandomUser("ADM");
        admin = await createUser(adminUser);
        adminUser = createRandomUser("ADM");
        admin2 = await createUser(adminUser);
        adminToken = jwt.sign({ userId: admin.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
        notAdminToken = jwt.sign({ userId: notAdmin.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });

        payload1 = {
            userId: user.data.dataValues.id
        }
        payload2 = {

        }
        payload3 = {
            userId: "jcvdsijdj"
        }
        payload4 = {
            userId: v4()
        }
        payload5 = {
            userId: admin2.data.dataValues.id
        }
    });



 
    it('test /api/admin/deactivate-user delete user successfull', async () => {
        const response = await request(app).delete("/api/admin/deactivate-user").send(payload1).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('test /api/admin/deactivate-user when token not sent', async () => {
        const response = await request(app).delete("/api/admin/deactivate-user").send(payload1);
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Access denied');
    });

    it('test /api/admin/deactivate-user when other than admin', async () => {
        const response = await request(app).delete("/api/admin/deactivate-user").send(payload1).set("Authorization", "Bearer " + notAdminToken);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied');
    });

    it('test /api/admin/deactivate-user when user id not given', async () => {
        const response = await request(app).delete('/api/admin/deactivate-user').send(payload2).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"userId\" is required');
    });

    it('test /api/admin/deactivate-user when valid UUID not given', async () => {
        const response = await request(app).delete('/api/admin/deactivate-user').send(payload3).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"userId\" must be a valid GUID');
    });

    it('test /api/admin/deactivate-user when user not exist', async () => {
        const response = await request(app).delete('/api/admin/deactivate-user').send(payload4).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User Not Found');
    });

    it('test /api/admin/deactivate-user when user is admin', async () => {
        const response = await request(app).delete('/api/admin/deactivate-user').send(payload5).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Access denied');
    });

});



describe("enable user", () => {
    let userPayload = createRandomUser("USR");
    let userData = createRandomUser("USR");
    let adminToken, notAdminToken, user, notAdmin, adminUser, admin, admin2;

    beforeAll(async () => {
        user = await createUser(userData);
        let payload = {
            userId: user.data.dataValues.id
        }
        await deactivateUser(payload);
        notAdmin = await createUser(userPayload);
        adminUser = createRandomUser("ADM");
        admin = await createUser(adminUser);
        adminUser = createRandomUser("ADM");
        adminToken = jwt.sign({ userId: admin.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
        notAdminToken = jwt.sign({ userId: notAdmin.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });

        payload1 = {
            userId: user.data.dataValues.id
        }
        payload2 = {

        }
        payload3 = {
            userId: "jcvdsijdj"
        }
        payload4 = {
            userId: v4()
        }
    });



  

    it('test /api/admin/enable-user activate user successfull', async () => {
        const response = await request(app).patch("/api/admin/enable-user").send(payload1).set("Authorization", "Bearer " + adminToken);
        console.log(response.body.message);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('test /api/admin/enable-user when token not sent', async () => {
        const response = await request(app).patch("/api/admin/enable-user").send(payload1);
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Access denied');
    });

    it('test /api/admin/enable-user when other than admin', async () => {
        const response = await request(app).patch("/api/admin/enable-user").send(payload1).set("Authorization", "Bearer " + notAdminToken);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied');
    });

    it('test /api/admin/enable-user when user id not given', async () => {
        const response = await request(app).patch('/api/admin/enable-user').send(payload2).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"userId\" is required');
    });

    it('test /api/admin/enable-user when valid UUID not given', async () => {
        const response = await request(app).patch('/api/admin/enable-user').send(payload3).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"userId\" must be a valid GUID');
    });

    it('test /api/admin/enable-user when user not exist', async () => {
        const response = await request(app).patch('/api/admin/enable-user').send(payload4).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User not found');
    });


});





describe('get user details by Id (Admin)', () => {
    let userData = createRandomUser("USR");
    let adminUser = createRandomUser("ADM");
    let userDetail = createRandomUser("USR");
    let admin, adminToken, notAdmin, notAdminToken, user;

    beforeAll(async () => {
        notAdmin = await createUser(userData);
        admin = await createUser(adminUser);
        user = await createUser(userDetail);
        adminToken = jwt.sign({ userId: admin.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
        notAdminToken = jwt.sign({ userId: notAdmin.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
        payload1 = user.data.dataValues.id;
        payload2 = faker.datatype.uuid();

    });

   

    it('test /api/admin/user-details/:userId get user details', async () => {
        const response = await request(app).get(`/api/admin/user-details/${payload1}`).set("Authorization", "Bearer " + adminToken);
        console.log(response.body.message);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('test /api/admin/user-details/:userId when token not sent', async () => {
        const response = await request(app).get(`/api/admin/user-details/${payload1}`);
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe('Access denied');
    });

    it('test /api/admin/user-details/:userId when other than admin', async () => {
        const response = await request(app).get(`/api/admin/user-details/${payload1}`).set("Authorization", "Bearer " + notAdminToken);
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Access denied');
    });

    it('test /api/admin/user-details/:userId when userId not sent in params', async () => {
        const response = await request(app).get(`/api/admin/user-details`).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid endpoint');
    });

    it('test /api/admin/user-details/:userId when userId sent in params is invalid', async () => {
        const response = await request(app).get(`/api/admin/user-details/50c6`).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"userId\" must be a valid GUID');
    });

    it('test /api/admin/user-details/:userId when user not exist', async () => {
        const response = await request(app).get(`/api/admin/user-details/${payload2}`).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User Not Found');
    });

});



describe('forget password', () => {
    let userData = createRandomUser("USR");
    let user;

    beforeAll(async () => {
        user = await createUser(userData);

        payload1 = {
            email: user.data.dataValues.email
        }

        payload2 = {
            email: v4()
        }

        payload3 = {
            email: faker.internet.email()
        }
    });

    

    it('test /api/user/forget-password successfull', async () => {
        const response = await request(app).post(`/api/user/forget-password`).send(payload1);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
    });
    it('test /api/user/forget-password when email not sent', async () => {
        const response = await request(app).post(`/api/user/forget-password`);
        console.log(response.body.message);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"email\" is required');
    });
    it('test /api/user/forget-password when invalid email sent', async () => {
        const response = await request(app).post(`/api/user/forget-password`).send(payload2);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"email\" must be a valid email');
    });
    it('test /api/user/forget-password when user not exist', async () => {
        const response = await request(app).post(`/api/user/forget-password`).send(payload3);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User Not Found!');
    });
});



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



describe('reset password by link', () => {
    let userData = createRandomUser("USR");
    let user, token;

    beforeAll(async () => {
        user = await createUser(userData);
        token = await forgetPassword({ email: user.data.dataValues.email });
        payload1 = {
            password: faker.internet.password()
        }
        payload2 = {
            password: faker.internet.password(3)
        }
        fakeToken = UniqueStringGenerator.UniqueString();
    });

  
    it('test /api/user/reset-password/:token successfull', async () => {
        const response = await request(app).post(`/api/user/reset-password/${token}`).send(payload1);
        // console.log(response.body.message);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
    });

    it('test /api/user/reset-password/:token when password not sent', async () => {
        const response = await request(app).post(`/api/user/reset-password/${token}`);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"password\" is required');
    });

    it('test /api/user/reset-password/:token when password invalid', async () => {
        const response = await request(app).post(`/api/user/reset-password/${token}`).send(payload2);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe('\"password\" should be at least 4 characters long');
    });

    it('test /api/user/reset-password/:token invalid token', async () => {
        const response = await request(app).post(`/api/user/reset-password/${fakeToken}`).send(payload1);
        console.log(response.body.message);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Invalid Reset Link');
    });
});





afterAll(async () => {
    await models.UserRoleMapping.destroy({
        where: {
        },
        force: true
    });
    await models.UserDesignationMapping.destroy({
        where: {
        },
        force: true
    });
    await models.UserReporteeMapping.destroy({
        where: {
        },
        force: true
    });
    await models.User.destroy({
        where: {
        },
        force: true
    });
});