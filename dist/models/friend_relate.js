module.exports = function (sequelize, Sequelize) {
    var Friendrelate = sequelize.define('friend_relates', {
        userid: {
            type: Sequelize.INTEGER,
            notEmpty: true,
            primaryKey: true,
            references: {
                model: "users",
                key: "userid"
            }
        },
        friendid: {
            type: Sequelize.INTEGER,
            notEmpty: true,
            primaryKey: true,
            references: {
                model: "users",
                key: "userid"
            }
        },
        datetime_makefriend: {
            type: Sequelize.DATE
        }
    }, {
        timestamps: false,
        // If don't want createdAt
        createdAt: false,
        // If don't want updatedAt
        updatedAt: false,
    });
    return Friendrelate;
};
//# sourceMappingURL=friend_relate.js.map