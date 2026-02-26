const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "shop",
    password: "Zellar2036",
    port: 5432,
});

module.exports = pool;