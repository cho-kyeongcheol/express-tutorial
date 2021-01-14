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


exports.PostFile = function() {
    
  const sequelize = exports.getConnection();

  const post_file = sequelize.define('post_file', {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      target_id: {
        type: DataTypes.INTEGER    
      },     
      filepath: {
        type: DataTypes.STRING(255)
      },
      filename: {
        type: DataTypes.STRING(255)
      },
      sort: {
        type: DataTypes.INTEGER        
      },
      create_id: {
        type: DataTypes.INTEGER        
      },
      del_yn: {
        type: DataTypes.STRING(2),
        defaultValue: 'y'
      },
      create_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
      },
      extension: {
        type: DataTypes.STRING(10)
      },
      file_type: {
        type: DataTypes.STRING(20)
      }
    }, {
        // Other model options go here
        timestamps: false,
        tableName: 'post_file'
    });
    return post_file;
  }



exports.Todos = function() {

  const sequelize = exports.getConnection();

  const todos = sequelize.define('todos', {
    bbs_eq: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bbs_key: {
      type: DataTypes.INTEGER      
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    },   
    title: {
      type: DataTypes.STRING(60),
      allowNull: false
    },   
    user_eq: {
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
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    board_type: {
      type: DataTypes.STRING(20),
      defaultValue: 'news'
    }, 
    parent_id: {
      type: DataTypes.INTEGER
    },
    reply_levels: {
      type: DataTypes.INTEGER
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
        user_eq: {
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
        login_eq: {
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