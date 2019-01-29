module.exports = {
    development: {
      username: "root",
      password: "wnJlBc3mp02B6uOM",
      database: "ayojodb",
      host: "35.220.175.107",
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
  