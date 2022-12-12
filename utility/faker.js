const { faker } = require("@faker-js/faker");

function createRandomUser() {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(10),
    organization: faker.company.bs(),
    role_key: faker.helpers.arrayElement(['USR', 'ADM']),
    designation_code: faker.helpers.arrayElement(['101', '102', '103', '104'])
  };
}

module.exports = {
    createRandomUser
}