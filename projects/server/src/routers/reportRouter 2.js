const router = require("express").Router();
const reportController = require("../controllers/reportController");
const authorizeLoggedInUser = require("../middlewares/authMiddleware");
const { adminMiddleware } = require("../middlewares/customerMiddleware");

router.post(
    `/transaction`,
    authorizeLoggedInUser,
    adminMiddleware,
    reportController.getTransactionReport
);

module.exports = router;
