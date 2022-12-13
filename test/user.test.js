const app = require("../app");
const request = require("supertest");
const models = require("../models");
const { faker } = require("@faker-js/faker");
const { createUser } = require('../services/user.service');
const { createRandomUser } = require("../utility/faker");
const jwt = require("jsonwebtoken");
const logger = require("../utility/logger");
const redis = require("../utility/redis");
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
        const response =  await createUser(userPayload);
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
        console.log(response.body,"---------->");
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
      
       it("tests /api/admin/create-user create-user successfull", async () => {
            const response = await request(app).post("/api/admin/create-user").send(user2).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Success");
            expect(response.body.data.email).toBe(user2.email);
        });
        
        it("tests /api/admin/create-user create-user with user login", async () => {
            const response = await request(app).post("/api/admin/create-user").send(user1).set("Authorization","Bearer "+userToken);
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe("Access denied");
        });
        
        it("tests /api/admin/create-user create-user without login", async () => {
            const response = await request(app).post("/api/admin/create-user").send(user2);
            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe("Access denied");
        });
        
        it("tests /api/admin/create-user create-user already exist", async () => {
            const response = await request(app).post("/api/admin/create-user").send(user1).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });
      
        it("tests /api/admin/create-user create-user without first_name", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.first_name;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"first_name\" is required");
        });  
      
        it("tests /api/admin/create-user create-user with empty string in first_name", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.first_name="";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"first_name\" is not allowed to be empty");
        });      
      
        it("tests /api/admin/create-user create-user with null value in first_name", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.first_name=null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"first_name\" must be a string");
        });       

        it("tests /api/admin/create-user create-user without last_name", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.last_name;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"last_name\" is required");
        });  
      
         it("tests /api/admin/create-user create-user with empty string in last_name", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.last_name="";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"last_name\" is not allowed to be empty");
        });      
      
        it("tests /api/admin/create-user create-user with null value in last_name", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.last_name=null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"last_name\" must be a string");
        }); 
        
        it("tests /api/admin/create-user create-user without email", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.email;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"email\" is required");
        });  
        
        it("tests /api/admin/create-user create-user with null email", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.email = null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"email\" must be a string");
        });  
      
        it("tests /api/admin/create-user create-user invalid email", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.email = faker.datatype.string();
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"email\" must be a valid email");
        });  
        
        it("tests /api/admin/create-user create-user without password", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.password;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"password\" is required");
        });  
      
        it("tests /api/admin/create-user create-user with null password", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.password = null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"password\" must be a string");
        });  
      
        it("tests /api/admin/create-user create-user with empty string password", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.password = "";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"password\" is not allowed to be empty");
        });  
      
        it("tests /api/admin/create-user create-user with password length 3", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.password = "abc";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"password\" should be at least 4 characters long");
        });  
      
        it("tests /api/admin/create-user create-user with password length 17", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.password = "abc5678901raghvar";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"password\" should not be longer than 16 characters");
        });  
      
        it("tests /api/admin/create-user create-user without organization", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.organization;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"organization\" is required");
        });  
      
        it("tests /api/admin/create-user create-user with empty organization", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.organization = '';
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"organization\" is not allowed to be empty");
        });  
      
        it("tests /api/admin/create-user create-user with null organization", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.organization = null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"organization\" must be a string");
        });  
      
        it("tests /api/admin/create-user create-user without source", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.source;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"source\" is required");
        });  
      
        it("tests /api/admin/create-user create-user with empty source", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.source = '';
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"source\" is not allowed to be empty");
        }); 
      
        it("tests /api/admin/create-user create-user with null source", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.source = null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"source\" must be a string");
        });
      
        it("tests /api/admin/create-user create-user without designation_code", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.designation_code;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"designation_code\" is required");
        });  
      
      
        it("tests /api/admin/create-user create-user with string designation_code", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.designation_code = "";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"designation_code\" must be a number");
        });  
      
        it("tests /api/admin/create-user create-user with invalid designation_code", async () => {
            const payload = JSON.parse(JSON.stringify(user3));
            payload.designation_code = "556";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Invalid Designation");
        });  
       
        it("tests /api/admin/create-user create-user without google_id", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.google_id;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"google_id\" is required");
        });  
      
        it("tests /api/admin/create-user create-user without google_id", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.google_id = null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"google_id\" must be a string");
        });  
      
        it("tests /api/admin/create-user create-user without google_id", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.google_id = "";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"google_id\" is not allowed to be empty");
        });  
        
        it("tests /api/admin/create-user create-user without role_key", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            delete payload.role_key;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"role_key\" is required");
        });  
      
        it("tests /api/admin/create-user create-user empty string role_key", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.role_key = "";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"role_key\" is not allowed to be empty");
        });  
      
        it("tests /api/admin/create-user create-user with null role_key", async () => {
            const payload = JSON.parse(JSON.stringify(user2));
            payload.role_key = null;
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(422);
            expect(response.body.message).toBe("\"role_key\" must be a string");
        });
      
        it("tests /api/admin/create-user create-user with invalid role_key", async () => {
            const payload = JSON.parse(JSON.stringify(user3));
            payload.role_key = "tyu";
            const response = await request(app).post("/api/admin/create-user").send(payload).set("Authorization","Bearer "+adminToken);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Invalid Role");
        });   
  });

  