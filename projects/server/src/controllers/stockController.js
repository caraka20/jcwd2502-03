const stockServices = require("../services/stockServices");
const db = require("./../models");
const { sequelize } = require("./../models");
const { deleteFiles } = require("./../helper/deleteFile");
const stockMutasiService = require("../services/stockHistoriesService");
const { where } = require("sequelize");
module.exports = {
  allStock: async (req, res, next) => {
    try {
      const hasil = await stockServices.getAllStock(req.query);
      res.status(200).send({
        isError: false,
        message: "All Product Stock Success",
        data: hasil,
      });
    } catch (error) {
      next(error);
    }
  },
  totalStockProduct: async (req, res, next) => {
    try {
      const hasil = await stockServices.totalProductStock(req.query);
      res.status(200).send({
        isError: false,
        message: "All Product Stock Success",
        data: hasil,
      });
    } catch (error) {
      next(error);
    }
  },
  // transactionStock : async (req, res, next) => {
  //             try {
  //                 // const hasil = await stockServices.kurangiStock({...req.query,...req.body})
  //                 const stockH = await stockMutasiService.createStockHistories({...req.query,...req.body, "Berkurang",  })
  //                 res.status(200).send({
  //                     isError: false,
  //                     message: "Success",
  //                     data: null,
  //                   });
  //             } catch (error) {
  //                 next(error)
  //             }
  //         }

  addStockProduct: async (req, res, next) => {
    try {
      const hasil = await stockServices.tambahStock({
        ...req.query,
        ...req.body,
      });
      res.status(200).send({
        isError: false,
        message: "Success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  minStockProduct: async (req, res, next) => {
    try {
      const hasil = await stockServices.kurangStock({
        ...req.query,
        ...req.body,
      });
      res.status(200).send({
        isError: false,
        message: "Success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  stockByWarehouse: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
    } catch (error) {
      next(error);
    }
  },

  requestProduct: async (req, res, next) => {
    try {
      // const {quantity,products_id, users_id, request_warehouses_id, sender_warehouses_id} = req.body
      const hasil = await db.stocks_mutations.create({
        ...req.body,
        status: "Pending",
      });
      res.status(200).send({
        isError: false,
        message: "succes request mutasi",
        data: hasil,
      });
    } catch (error) {
      next(error);
    }
  },

  editStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await db.stocks_mutations.findByPk(id);

      if (status === "Declined") {
        // console.log("ok");
        const newData = await db.stocks_mutations.update(
          { status: "Declined" },
          { where: { id: id } }
        );
        return res.status(200).send({
          isError: false,
          message: "Request Ditolak",
          data: null,
        });
      } else if (status === "Approved") {
        const datas = [
          {
            status: "Berkurang",
            quantity: data.dataValues.quantity,
            reference: `REQ-${data.dataValues.id}`,
            products_id: data.dataValues.products_id,
            warehouses_id: data.dataValues.sender_warehouses_id,
          },
          {
            status: "Bertambah",
            quantity: data.dataValues.quantity,
            reference: `REQ-${data.dataValues.id}`,
            products_id: data.dataValues.products_id,
            warehouses_id: data.dataValues.request_warehouses_id,
          },
        ];
        const newData = await db.stocks_mutations.update(
          { status: "Approved" },
          { where: { id } }
        );
        const postHistory = await db.products_stocks_histories.bulkCreate(
          datas
        );
        const dataKurang = await db.products_stocks.findOne({
          where: {
            products_id: data.dataValues.products_id,
            warehouses_id: data.dataValues.sender_warehouses_id,
          },
        });
        const dataTambah = await db.products_stocks.findOne({
          where: {
            products_id: data.dataValues.products_id,
            warehouses_id: data.dataValues.request_warehouses_id,
          },
        });
        const updateStockKurang = await db.products_stocks.update(
          { stock: dataKurang.dataValues.stock - data.dataValues.quantity },
          { where: { id: dataKurang.dataValues.id } }
        );
        const updateStockTambah = await db.products_stocks.update(
          { stock: dataTambah.dataValues.stock + data.dataValues.quantity },
          { where: { id: dataTambah.dataValues.id } }
        );
        return res.status(200).send({
          isError: false,
          message: "success diterima",
          data: postHistory,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
