const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "medusa-auction-demo",
  entities: ["dist/models/*.js"],
  migrations: ["dist/migrations/*.js"],
});

module.exports = {
  datasource: AppDataSource,
};
