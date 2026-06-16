const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/way2fresher';

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: DATABASE_URL.includes('railway') || DATABASE_URL.includes('render') || DATABASE_URL.includes('neon')
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

module.exports = sequelize;
