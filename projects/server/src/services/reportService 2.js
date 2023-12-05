const Service = require("./service");
const db = require("../models/");
const { sequelize } = require("../models");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");

class ReportService extends Service {
    static getTransactionReport = async (
        stateOfDate,
        warehouses_id,
        role,
        productId,
        status,
        products_categories_id,
        warehouses_id2,
    ) => {
        const TODAY_START = moment().startOf("day");
        const NOW = moment().format("YYYY-MM-DD HH:mm:ss");

        try {
            let where = {};
            let where2 = {};
            // if (stateOfDate === "Harian") {
            //     where.createdAt = {
            //         [Op.gt]: TODAY_START,
            //         [Op.lt]: NOW,
            //     };
            // }
            // if (stateOfDate === "Mingguan") {
            //     where.createdAt = {
            //         [Op.gt]: moment(TODAY_START).subtract(1, "week"),
            //         [Op.lt]: NOW,
            //     };
            // }
            // if (stateOfDate === "Bulanan") {
            //     where.createdAt = {
            //         [Op.gt]: moment(TODAY_START).subtract(1, "month"),
            //         [Op.lt]: NOW,
            //     };
            // }
            // if (stateOfDate === "Tahunan") {
            //     where.createdAt = {
            //         [Op.gt]: moment(TODAY_START).subtract(1, "year"),
            //         [Op.lt]: NOW,
            //     };
            // }

            if (stateOfDate) {
                where.createdAt = {
                    [Op.and]: [
                        sequelize.literal(`MONTH(orders_details.createdAt) = ${stateOfDate}`)
                    ]
                };
            }

            if (warehouses_id2 && role === "Owner") {
                where.warehouses_id = Number(warehouses_id2);
            }

            if (role === "Warehouse Admin") {
                where.warehouses_id = warehouses_id;
            }

            if (productId) {
                where.products_id = productId;
            }

            if (status) {
                where.status = status;
            }

            if (products_categories_id) {
                where2.products_categories_id = products_categories_id;
            }

            let countNewOrder;
            console.log(where);
            if (role === "Owner") {
                countNewOrder = await db.orders_details.findAll({
                    include: [
                        {
                            model: db.products,
                            where: where2,
                        },
                        {
                            model: db.warehouses,
                        },
                    ],
                    where,
                    group: ["transaction_uid"],
                    // order: ["createdAt", "DESC"],
                });
            } else if (role === "Warehouse Admin") {
                countNewOrder = await db.orders_details.findAll({
                    include: [
                        {
                            model: db.products,
                            where: where2,
                        },
                        {
                            model: db.warehouses,
                        },
                    ],
                    where,
                    group: ["transaction_uid"],
                    // order: [["createdAt", "DESC"]],
                });
            }

            let result = {
                countNewOrder,
            };

            console.log(result.countNewOrder.length);

            return this.handleSuccess({
                statusCode: 201,
                message: "Success get data!",
                data: result,
            });
        } catch (error) {
            console.log(error);
            return this.handleError({
                statusCode: 500,
                message: "Server Error",
            });
        }
    };
}

module.exports = ReportService;
