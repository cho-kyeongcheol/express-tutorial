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

exports.Todos = function() {

  const sequelize = exports.getConnection();

  const todos = sequelize.define('todos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    },   
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },    
    del_yn: {
      type: DataTypes.STRING(1),
      defaultValue: 'N'
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    update_at: {
      type: DataTypes.DATE
    },
    delete_at: {
      type: DataTypes.DATE
    }

  }, {
    // Other model options go here
    timestamps: false,
    tableName: 'todos'
});

console.log('todos => ', todos)
return todos;

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
        user_id: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(255)
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