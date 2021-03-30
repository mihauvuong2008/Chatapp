module.exports = function (sequelize, Sequelize) {
    var Unreadgroup = sequelize.define('unread_groups', {
        readerid: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "userid"
            }
        },
        unhide_usermindid: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
                model: "unhide_userminds",
                key: "unhide_usermindid"
            }
        },
        groupid: {
            type: Sequelize.INTEGER,
            references: {
                model: "chat_groups",
                key: "groupid"
            }
        },
        datetime_read: {
            type: Sequelize.DATE
        },
    }, {
        timestamps: false,
        // If don't want createdAt
        createdAt: false,
        // If don't want updatedAt
        updatedAt: false,
    });
    return Unreadgroup;
};
//# sourceMappingURL=unread_group.js.map