const { faker } = require("@faker-js/faker");

function createRandomUser(role,designation) {
  
  const userData = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(10),
    organization: faker.company.bs(),
    role_key: role || faker.helpers.arrayElement(['USR', 'ADM']),
    designation_code: designation || faker.helpers.arrayElement(['101', '102', '103', '104'])
  }
  userData.source = userData.organization;
  userData.google_id = userData.email;
  return userData;
}

module.exports = {
    createRandomUser
}