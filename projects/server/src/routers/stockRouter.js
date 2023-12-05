const router = require("express").Router();
const {stockController} = require("../controllers")

router.get("/", stockController.allStock);
router.get("/:id", stockController.allStock);
router.get("/total", stockController.totalStockProduct);
router.put("/tambah", stockController.addStockProduct);
router.put("/kurang", stockController.minStockProduct);
router.post("/request", stockController.requestProduct);
router.put("/respon/:id", stockController.editStatus);

module.exports = router;
