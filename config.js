const { Sequelize } = require('sequelize');
require('dotenv').config();
const { pg } = require('pg');

// const sequelize = new Sequelize(process.env.DB_URL, {
//     dialectModule: pg
// })
const sequelize = new Sequelize('sqlite::memory:');

const authSync = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.sync({ force: false });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}
  
authSync();
  
module.exports = sequelize