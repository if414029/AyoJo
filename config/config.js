module.exports = {
    development: {
      username: "root",
      password: "Alliswell19",
      database: "qlusterprofiledev",
      host: "127.0.0.1",
      dialect: 'mysql',
      logging: false,
    },
    test: {
      username: process.env.MY_USER,
      password: process.env.MY_PASS,
      database: process.env.MY_DBN,
      host: process.env.MY_HOST,
      dialect: 'mysql',
    },
    production: {
      username: "root",
      password: "Alliswell19",
      database: "qlusterprofilecloud",
      host:  "35.240.144.82",
      dialect: 'mysql',
      dialectOptions: {
        socketPath: `/cloudsql/qlusteramos:asia-southeast1:intern-qluster-18`,
      },
    },
  }
  