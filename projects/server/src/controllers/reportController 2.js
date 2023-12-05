const ReportService = require("../services/reportService");

const { userRole } = require("../services/orderService");

const reportController = {
    getTransactionReport: async (req, res) => {
        try {
            const { id } = req.tokens;

            const userData = await userRole(id);

            const serviceResult = await ReportService.getTransactionReport(
                req.query.stateOfDate,
                userData.dataValues.warehouses_id,
                userData.dataValues.role,
                req.query.productId,
                req.query.status,
                req.query.products_categories_id,
                req.query.warehouses_id2,
            );

            if (!serviceResult.success) throw serviceResult;

            return res.status(serviceResult.statusCode || 200).json({
                message: serviceResult.message,
                result: serviceResult.data,
            });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode || 500).json({
                message: error.message,
            });
        }
    },
};

module.exports = reportController;
