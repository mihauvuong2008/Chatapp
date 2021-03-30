module.exports = function (sequelize, Sequelize) {
    var Unknowstory = sequelize.define('unknow_stories', {
        userid: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
                model: "users",
                key: "userid"
            }
        },
        part_of_realid: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            references: {
                model: "part_of_reals",
                key: "part_of_realid"
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
    return Unknowstory;
};
//# sourceMappingURL=unknow_story.js.map