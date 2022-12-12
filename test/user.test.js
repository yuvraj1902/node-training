const app = require("../app");
const request = require("supertest");
const models = require("../models");
const { faker } = require("@faker-js/faker");
const { createUser } = require('../services/user.service');
const { sequelize } = require("../models");
const { createRandomUser } = require("../utility/faker");
const jwt = require("jsonwebtoken");
const userRoleMappingModel = require("../models/userRoleMapping.model");
require("dotenv").config();



describe("user login test cases", () => {

    const responseObject = {};
    let user;
    const userPayload = createRandomUser();
    userPayload.email = userPayload.email.toLowerCase();

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
        userPayload.source = userPayload.organization;
        userPayload.google_id = userPayload.email;
        console.log(userPayload);
        const response =  await createUser(userPayload);
        user = await models.User.findOne({ where: { email: userPayload.email } });
        console.log(user, 'gwefwigfggfhwv');
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
    })



    it("tests api/user/login login successfuly", async () => {
    const response = await request(app).post("/api/user/login").send(loginPayload);
        expect(response.statusCode).toBe(200);
        expect(jwt.verify(response.body.data.accessToken,process.env.SECRET_KEY_ACCESS).userId).toBe(user.id);
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

      let userPayload = createRandomUser();
      let token;
      
      beforeEach(async () => {
        userPayload.email = userPayload.email.toLowerCase();
        userPayload.source = userPayload.organization;
          userPayload.google_id = userPayload.email;
          userPayload.role_key="USR"
          
          const adminUser = createRandomUser();
          adminUser.email = adminUser.email.toLowerCase();
            adminUser.source = adminUser.organization;
          adminUser.google_id = adminUser.email;
          adminUser.role_key = "ADM";


          const response = await createUser(adminUser);
          console.log(response.data.id);
          
          token = jwt.sign({ userId: response.data.id }, process.env.SECRET_KEY_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
          
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
    })



    it("tests /api/admin/create-user create-user successfull", async () => {
    const response = await request(app).post("/api/admin/create-user").send(userPayload).set("Authorization","Bearer "+token);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Success");
        expect(response.body.data.email).toBe(userPayload.email);
    });
    
    // it("tests api/user/login wrong password", async () => {
    // const response = await request(app).post("/api/user/login").send(loginPayload1);
    //     expect(response.statusCode).toBe(400);
    //     expect(response.body.message).toBe("Wrong email or password");
    // });
    
    // it("tests api/user/login wrong email", async () => {
    // const response = await request(app).post("/api/user/login").send(loginPayload2);
    //     expect(response.statusCode).toBe(400);
    //     expect(response.body.message).toBe("User Not Found!");
    // });

    // it("tests api/user/login invalid email", async () => {
    // const response = await request(app).post("/api/user/login").send(loginPayload3);
    //     expect(response.statusCode).toBe(422);
    //     expect(response.body.message).toBe("\"email\" must be a valid email");
    // });

    // it("tests api/user/login no email", async () => {
    // const response = await request(app).post("/api/user/login").send(loginPayload4);
    //     expect(response.statusCode).toBe(422);
    //     expect(response.body.message).toBe("\"email\" is required");
    // });

    // it("tests api/user/login no password", async () => {
    // const response = await request(app).post("/api/user/login").send(loginPayload5);
    //     expect(response.statusCode).toBe(422);
    //     expect(response.body.message).toBe("\"password\" is required");
    // });

    // it("tests api/user/login no email password", async () => {
    // const response = await request(app).post("/api/user/login").send(loginPayload6);
    //     expect(response.statusCode).toBe(422);
    //     expect(response.body.message).toBe("\"email\" is required");
    // });

  });