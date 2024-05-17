const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {    //is the same as normal export.
  
    const user = sequelize.define("user", {
      uid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      fbid: {
        //allowNull: false,
        type: Sequelize.STRING
      },
      verified: {
        type: Sequelize.BOOLEAN
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      account: {
        type: Sequelize.INTEGER
      },
      services: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.BOOLEAN
      }, 
      region: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      format: {
        type: Sequelize.INTEGER
      }
    },
    { 
      tableName: 'users'
    });
    //Not sure yet.
    // user.pre('save', async function(){
    //   //hash and salt password
    //   try{
    //     const hash = await argon2.hash(this.password, {
    //       type: argon2.argon2id
    //     });
    //     this.password = hash;
    //   }
    //   catch(err){
    //     console.log('Error in hashing password'+ err);
    //   }
    // })
    
    return user;
  };
