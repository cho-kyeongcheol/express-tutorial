const fs = require('fs');
const { Sequelize, DataTypes } = require('sequelize');

exports.getConnection = function() {

    const rawdata = fs.readFileSync('./config/config.json');
    const info = JSON.parse(rawdata);

    // Getting Started
    const sequelize = new Sequelize(
        info.db_name, 
        info.username, 
        info.password, 
        info.connection
    );
    return sequelize;
}

exports.Users = function() {
    
    const sequelize = exports.getConnection();

    const users = sequelize.define('users', {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        create_at: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW
        },
        update_at: {
          type: DataTypes.DATE
        }
      }, {
        // Other model options go here
        timestamps: false,
        tableName: 'users'
    });

    console.log('users => ', users)
    return users;
}

exports.UsersLogin = function() {
    
    const sequelize = exports.getConnection();

    const users_login = sequelize.define('users_login', {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        login_cnt: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        }
      }, {
        // Other model options go here
        timestamps: false,
        tableName: 'users_login'
    });
    return users_login;
}