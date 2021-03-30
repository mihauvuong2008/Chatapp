module.exports = function(sequelize, Sequelize) {

    var Memberofchatgroup = sequelize.define('member_of_chat_groups', {

        groupid: {
            notEmpty: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
              model: "chat_groups",
              key: "groupid"
            }
        },

        userid: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            notEmpty: true,
            references: {
              model: "users",
              key: "userid"
            }
        },

        datetime_join: {
            type: Sequelize.DATE
        }

    },
    {

    timestamps: false,

    // If don't want createdAt
    createdAt: false,

    // If don't want updatedAt
    updatedAt: false,
  });

    return Memberofchatgroup;

}
