'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FriendRequests extends Model {
        // /**
        // * Helper method for defining associations.
        // * This method is not a part of Sequelize lifecycle.
        // * The `models/index` file will call this method automatically.
        // */
        static associate(models) {
            // define association here
        }
    }
    ;
    FriendRequests.init({
        partnerid: {
            type: DataTypes.INTEGER,
            notEmpty: true,
            primaryKey: true,
            references: {
                model: "users",
                key: "userid"
            }
        },
        userid: {
            type: DataTypes.INTEGER,
            notEmpty: true,
            primaryKey: true,
            references: {
                model: "users",
                key: "userid"
            }
        },
        datetimesendrequest: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'friend_requests',
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    });
    return FriendRequests;
};
//# sourceMappingURL=friend_requests.js.map