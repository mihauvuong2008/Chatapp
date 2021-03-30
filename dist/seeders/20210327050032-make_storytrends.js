'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        queryInterface.createTable('make_storytrends', {
            maketter: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "userid"
                }
            },
            sheep: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "userid"
                }
            },
            storyid: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                references: {
                    model: "part_of_reals",
                    key: "part_of_realid"
                }
            },
            datetime_maketrend: {
                type: Sequelize.DATE
            }
        }, {
            timestamps: false,
            // If don't want createdAt
            createdAt: false,
            // If don't want updatedAt
            updatedAt: false,
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('make_storytrends', null, {});
    })
};
//# sourceMappingURL=20210327050032-make_storytrends.js.map