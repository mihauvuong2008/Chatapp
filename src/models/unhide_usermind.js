module.exports = function(sequelize, Sequelize) {

    var Unhideusermind = sequelize.define('unhide_userminds', {

        unhide_usermindid: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true,
            references: {
              model: "users",
              key: "userid"
            }
        },

        message_data: {
            type: Sequelize.STRING.BINARY,
            notEmpty: true
        },

        datetime_unhide: {
            type: Sequelize.DATE,
            notEmpty: true
        }
    },
    {

    timestamps: false,

    // If don't want createdAt
    createdAt: false,

    // If don't want updatedAt
    updatedAt: false,
  });

    return Unhideusermind;

}
