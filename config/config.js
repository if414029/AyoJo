module.exports = {
    development: {
      username: "root",
      password: "Alliswell19",
      database: "ayojo",
      host: "127.0.0.1",
      dialect: 'mysql',
      logging: true,
    },
    test: {
      username: process.env.MY_USER,
      password: process.env.MY_PASS,
      database: process.env.MY_DBN,
      host: process.env.MY_HOST,
      dialect: 'mysql',
    },
    production: {
      username: process.env.MY_USER,
      password: process.env.MY_PASS,
      database: process.env.MY_DBN,
      host:  process.env.MY_HOST,
      dialect: 'mysql',
      dialectOptions: {
        socketPath: `/cloudsql/ayojodevelopment:asia-east2:dbayodev`,
      },
    },
  }
  