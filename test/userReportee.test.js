const app = require("../app");
const request = require("supertest");
const models = require("../models");
const { faker } = require("@faker-js/faker");
const { createUser } = require('../services/user.service');
const { createRandomUser } = require("../utility/faker");
const jwt = require("jsonwebtoken");
const logger = require("../utility/logger");
const redis = require("../utility/redis");
const { addReportee } = require("../services/userReportee.service");
require("dotenv").config();
logger.init();
redis.connect();




// admin add repotee test cases
describe("admin add reportee test cases", () => {

    const adminPayload = createRandomUser("ADM", "101");
    const managerPayload = createRandomUser("USR", "102");
    const userPayload = createRandomUser("USR", "104");


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

    


    it("tests api/admin/add-reportee add repotee successfuly", async () => {
        console.log(reporteePayload);
        const response = await request(app).post("/api/admin/add-reportee").send(reporteePayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toMatchObject({
            manager_id: reporteePayload.managerId,
            reportee_id: reporteePayload.reporteeId
        });
    });


    it("tests api/admin/add-reportee add repotee when Already existing relation ", async () => {
        const response = await request(app).post("/api/admin/add-reportee").send(reporteePayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Already existing relation");
    });


    it("tests api/admin/add-reportee add repotee with same manager_id and repotee_id ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
            reporteeId: reporteePayload.managerId,
        }
        const response = await request(app).post("/api/admin/add-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("This relation is not valid");
    });


    it("tests api/admin/add-reportee add repotee with wrong manager or repotee id ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
            reporteeId: '3df1b927-bec5-4fd9-a973-b11a631a2f04',
        }
        const response = await request(app).post("/api/admin/add-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User not found");
    });


    it("tests api/admin/add-reportee add repotee without login ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
            reporteeId: reporteePayload.managerId,
        }
        const response = await request(app).post("/api/admin/add-reportee").send(wrongPayload).set("Authorization", "Bearer " + '');
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");
    });


    it("tests api/admin/add-reportee add repotee with empty manager id or repotee id ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
        }
        const response = await request(app).post("/api/admin/add-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"reporteeId\" is required");
    });

    it("tests api/admin/add-reportee add repotee with wrong manager or repotee id ", async () => {
        const wrongPayload = {
            managerId: faker.datatype.uuid(),
            reporteeId: reporteePayload.managerId,
        }
        const response = await request(app).post("/api/admin/add-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User not found");
    });

});


// admin delete reportee api  test cases
describe("admin delete reportee test cases", () => {

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

        await addReportee(reporteePayload.managerId, reporteePayload.reporteeId);


        const admin = await models.User.findOne({ where: { email: adminPayload.email } });

        if (admin) {
            console.log(admin.dataValues.id);
            adminToken = jwt.sign({ userId: admin.id }, process.env.SECRET_KEY_ACCESS, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION
            });
        }
    });

    

    it("tests api/admin/delete-reportee delete repotee successfuly", async () => {
        const response = await request(app).delete("/api/admin/delete-reportee").send(reporteePayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.message).toBe("Relation successfully deleted");
    });


    it("tests api/admin/delete-reportee delete repotee when Already deleted relation ", async () => {
        const response = await request(app).delete("/api/admin/delete-reportee").send(reporteePayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Not Found");

    });


    it("tests api/admin/delete-reportee delete repotee with same manager_id and repotee_id ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
            reporteeId: reporteePayload.managerId,
        }
        const response = await request(app).delete("/api/admin/delete-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Unprocessable");
    });


    it("tests api/admin/delete-reportee delete repotee with wrong manager or repotee id ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
            reporteeId: '3df1b927-bec5-4fd9-a973-b11a631a2f04',
        }
        const response = await request(app).delete("/api/admin/delete-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User not found");
    });


    it("tests api/admin/delete-reportee delete repotee without login ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
            reporteeId: reporteePayload.managerId,
        }
        const response = await request(app).delete("/api/admin/delete-reportee").send(wrongPayload).set("Authorization", "Bearer " + '');
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");

    });


    it("tests api/admin/delete-reportee delete repotee with empty manager id or repotee id ", async () => {
        const wrongPayload = {
            managerId: reporteePayload.managerId,
        }
        const response = await request(app).delete("/api/admin/delete-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"reporteeId\" is required");
    });

    it("tests api/admin/delete-reportee delete repotee with wrong manager or repotee id ", async () => {
        const wrongPayload = {
            managerId: '3df1b927-bec5-4fd9-a973-b11a631a2f04',
            reporteeId: reporteePayload.managerId,
        }
        const response = await request(app).delete("/api/admin/delete-reportee").send(wrongPayload).set("Authorization", "Bearer " + adminToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User not found");
    });

});



// // manager add reportee test cases
describe("manager add reportee test cases", () => {

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

    

    it("tests api/user/add-reportee add repotee successfuly", async () => {
        let userReporteeData = {
            reporteeId: reporteePayload.managerId
        }
        const response = await request(app).post("/api/user/add-reportee").send(userReporteeData).set("Authorization", "Bearer " + adminToken);;
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Success");

    });

    it("tests api/user/add-reportee add repotee without login ", async () => {
        let userReporteeData = {
            reporteeId: reporteePayload.managerId
        }
        const response = await request(app).post("/api/user/add-reportee").send(userReporteeData).set("Authorization", "Bearer " + '');;
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");

    });

    it("tests api/user/add-reportee add repotee without reporteeId ", async () => {
        let userReporteeData = {
            reporteeId: ''
        }
        const response = await request(app).post("/api/user/add-reportee").send(userReporteeData).set("Authorization", "Bearer " + adminToken);;
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"reporteeId\" is not allowed to be empty");
    });

    it("tests api/user/add-reportee add repotee with wrong reporteeId ", async () => {
        let userReporteeData = {
            reporteeId: '3df1b927-bec5-4fd9-a973-b11a631a2f04'
        }
        const response = await request(app).post("/api/user/add-reportee").send(userReporteeData).set("Authorization", "Bearer " + adminToken);;
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User not found");
        // console.log(response.body,"--------------->aaaaaaa=================",);

    });

});

// // manger delete reportee api test cases
describe("manager delete reportee test cases", () => {

    const managerPayload = createRandomUser("USR", 102);
    const userPayload = createRandomUser("USR", 104);


    const reporteePayload = {}
    let managerToken;

    beforeAll(async () => {

        const managerResponse = await createUser(managerPayload);
        const userResponse = await createUser(userPayload);

        reporteePayload.managerId = managerResponse.data.id;
        reporteePayload.reporteeId = userResponse.data.id;

        await addReportee(reporteePayload.managerId, reporteePayload.reporteeId);

        const manager = await models.User.findOne({ where: { email: managerPayload.email } });

        if (manager) {
            managerToken = jwt.sign({ userId: managerResponse.data.id }, process.env.SECRET_KEY_ACCESS, {
                expiresIn: process.env.JWT_ACCESS_EXPIRATION
            });
        }
    });

   


    it("tests api/user/delete-reportee delete repotee successfuly", async () => {
        let userReporteeData = {
            reporteeId: reporteePayload.reporteeId
        }
        const response = await request(app).delete("/api/user/delete-reportee").send(userReporteeData).set("Authorization", "Bearer " + managerToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.message).toBe("Relation successfully deleted");
    });

    it("tests api/user/delete-reportee add repotee without login ", async () => {
        let userReporteeData = {
            reporteeId: reporteePayload.reporteeId
        }
        const response = await request(app).delete("/api/user/delete-reportee").send(userReporteeData).set("Authorization", "Bearer ");
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Access denied");

    });

    it("tests api/user/delete-reportee add repotee without reporteeId ", async () => {
        let userReporteeData = {
            reporteeId: ''
        }
        const response = await request(app).delete("/api/user/delete-reportee").send(userReporteeData).set("Authorization", "Bearer " + managerToken);;
        expect(response.statusCode).toBe(422);
        expect(response.body.message).toBe("\"reporteeId\" is not allowed to be empty");
    });

    it("tests api/user/delete-reportee add repotee with wrong reporteeId ", async () => {
        let userReporteeData = {
            reporteeId: '3df1b927-bec5-4fd9-a973-b11a631a2f04'
        }
        const response = await request(app).delete("/api/user/delete-reportee").send(userReporteeData).set("Authorization", "Bearer " + managerToken);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("User not found");

    });

});
