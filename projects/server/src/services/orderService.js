const db = require("./../models");
const { sequelize } = require("./../models");
const { Op } = require("sequelize");
const moment = require("moment");

const cron = require("node-cron");
module.exports = {
  addTocart: async (data) => {
    try {
      const addToCart = await db.carts.create(data);
      return addToCart;
    } catch (error) {
      return error;
    }
  },
  getCartByProductId: async (data) => {
    try {
      const getCart = await db.carts.findOne({
        where: { products_id: data.productId, users_id: data.userId },
      });

      return getCart;
    } catch (error) {
      return error;
      s;
    }
  },
  getProductById: async (productId) => {
    try {
      const getProduct = await db.products.findOne({
        where: { id: productId },
        include: [
          {
            model: db.products_stocks,
            attributes: ["stock"],
          },
        ],
      });
      return getProduct;
    } catch (error) {
      return error;
    }
  },
  addQuantityIfIdExist: async (data, qty) => {
    try {
      const add = db.carts.update(
        {
          quantity: sequelize.literal(`quantity + ${qty}`),
        },
        { where: { products_id: data } }
      );

      return add;
    } catch (error) {
      return error;
    }
  },
  getCartByUserId: async (data) => {
    try {
      const getCart = await db.carts.findAll({
        attributes: [
          "quantity",
          "products_id",
          [db.Sequelize.literal("quantity * product_price"), "total"],
          [db.Sequelize.literal("quantity * product_weight"), "total-weight"],
        ],
        include: [
          {
            model: db.products,
            attributes: ["product_name", "product_price"],
            where: { product_status: "Active" },
            include: [
              {
                model: db.products_images,
                attributes: ["image"],
              },
              {
                model: db.products_stocks,
                attributes: ["stock"],
                include: [
                  {
                    model: db.warehouses,
                    attributes: ["name", "id"],
                  },
                ],
              },
            ],
          },
        ],
        where: { users_id: data },
      });
      return getCart;
    } catch (error) {
      return error;
    }
  },

  deleteCart: async (data) => {
    try {
      const deleted = await db.carts.destroy({
        where: { products_id: data.productId, users_id: data.userId },
      });
      return deleted;
    } catch (error) {
      return error;
    }
  },
  getProductCartQty: async (data) => {
    try {
      const getQty = await db.carts.findOne({
        where: { products_id: data.productId, users_id: data.userId },
      });
      return getQty;
    } catch (error) {
      return error;
    }
  },
  updateQty: async (data) => {
    try {
      const update = await db.carts.update(
        { quantity: data.quantity },
        {
          where: { products_id: data.productId, users_id: data.userId },
        }
      );
    } catch (error) {
      return error;
    }
  },
  placementOrder: async (data) => {
    try {
      const placeOrder = await db.orders_details.bulkCreate(data);

      return placeOrder;
    } catch (error) {
      return error;
    }
  },
  updateUid: async (createdAt, formattedCreatedAt) => {
    try {
      const updateUid = await db.orders_details.update(
        {
          transaction_uid: formattedCreatedAt,
        },
        { where: { createdAt: createdAt } }
      );

      return updateUid;
    } catch (error) {
      return error;
    }
  },
  getAddessByUserId: async (data) => {
    try {
      const getAddress = await db.users_addresses.findAll({
        include: [
          {
            model: db.tb_ro_cities,
            attributes: ["city_name", "postal_code", "provinces_id"],
            include: [
              {
                model: db.tb_ro_provinces,
                attributes: ["province_name"],
              },
            ],
          },
        ],
        where: { users_id: data },
      });
      return getAddress;
    } catch (error) {
      return error;
    }
  },
  getAddressByPrimaryKey: async (data) => {
    try {
      const getAddressByPrimaryKey = await db.users_addresses.findOne({
        include: [
          {
            model: db.tb_ro_cities,
            attributes: ["city_name", "postal_code", "provinces_id"],
            include: [
              {
                model: db.tb_ro_provinces,
                attributes: ["province_name"],
              },
            ],
          },
        ],
        where: { users_id: data.id, is_primary: 1 },
      });
      return getAddressByPrimaryKey;
    } catch (error) {
      return error;
    }
  },

  getRajaOngkir: async (data) => {
    try {
      const getRajaOngkir = await db.tb_ro_provinces.findAll({
        include: [
          {
            model: db.tb_ro_cities,
            attributes: ["city_id", "city_name"],
          },
        ],
      });
      return getRajaOngkir;
    } catch (error) {
      return error;
    }
  },
  paymentMethod: async () => {
    try {
      const getPaymentMethod = await db.payment_methods.findAll();

      return getPaymentMethod;
    } catch (error) {
      return error;
    }
  },
  couriers: async () => {
    try {
      const getCouriers = await db.couriers.findAll();
      return getCouriers;
    } catch (error) {
      return error;
    }
  },
  addAddressById: async (data) => {
    try {
      const addAddress = await db.users_addresses.create(data);
      return addAddress;
    } catch (error) {
      return error;
    }
  },
  editAddress: async (data, idAddress, id) => {
    try {
      const editAddress = await db.users_addresses.update(data, {
        where: { id: idAddress, users_id: id },
      });
      return editAddress;
    } catch (error) {
      return error;
    }
  },
  getUserData: async (id) => {
    try {
      const getUser = await db.users.findByPk(id);
      return getUser;
    } catch (error) {
      return error;
    }
  },
  filterPaymentStatus: async (query, id) => {
    try {
      // "Payment Pending",
      // "Waiting for Payment Approval",
      // "Order Process",
      // "Package Sent",
      // "Package Arrived",
      // "Order Completed",
      // "Order Canceled"
      //  "Payment Pending"
      // ,

      if (query.status === "") {
        const filterPaymentStatusOrder = await db.orders_details.findAll({
          attributes: [
            "id",
            "transaction_uid",
            "quantity",
            "status",
            "createdAt",
            "updatedAt",
            "users_id",
            [
              db.Sequelize.fn("sum", db.Sequelize.col("product_price")),
              "total_price",
            ],
          ],
          where: {
            users_id: id,
            transaction_uid: { [db.Sequelize.Op.like]: `%${query.search}%` },
          },
          raw: true,
          group: ["transaction_uid"],
          order: [["createdAt", "DESC"]],
        });

        return filterPaymentStatusOrder;
      }
      const filterPaymentStatusOrder = await db.orders_details.findAll({
        attributes: [
          "transaction_uid",
          "quantity",
          "status",
          "createdAt",
          "updatedAt",
          "users_id",
          [
            db.Sequelize.fn("sum", db.Sequelize.col("product_price")),
            "total_price",
          ],
        ],
        raw: true,
        where: {
          users_id: id,
          status: query.status,
          transaction_uid: { [db.Sequelize.Op.like]: `%${query.search}%` },
        },
        group: ["transaction_uid"],
        order: [["createdAt", "DESC"]],
      });
      return filterPaymentStatusOrder;
    } catch (error) {
      return error;
    }
  },
  getWarehouseTerdekat2: async (datas) => {
    try {
      const data = await db.warehouses.findAll();
      let nearestWarehouse = null;
      let nearestDistance = Infinity;
      function degToRad(deg) {
        return deg * (Math.PI / 180);
      }
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius bumi dalam kilometer
        const dLat = degToRad(lat2 - lat1);
        const dLon = degToRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degToRad(lat1)) *
            Math.cos(degToRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.ceil(distance);
      }

      data.forEach((warehouse) => {
        const distance = calculateDistance(
          datas.lat,
          datas.lng,
          warehouse.lat,
          warehouse.lng
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestWarehouse = warehouse;
        }
      });

      return nearestWarehouse;
    } catch (error) {
      return error;
    }
  },
  createOrder: async (data) => {
    try {
      const createOrder = await db.orders.create(data);
      return createOrder;
    } catch (error) {
      return error;
    }
  },
  deleteCartProduct: async (id) => {
    try {
      const deleteCart = await db.carts.destroy({ where: { users_id: id } });
      return deleteCart;
    } catch (error) {
      return error;
    }
  },
  orderByTransactionId: async (transaction_uid, id) => {
    try {
      const order = await db.orders.findOne({
        attributes: [
          "total_price",
          "id",
          "address_detail",
          "transaction_uid",
          "warehouses_id",
        ],
        include: [
          {
            model: db.payment_methods,
            attributes: ["method"],
          },
          {
            model: db.users,
            attributes: ["fullname", "email"],
          },
          {
            model: db.tb_ro_cities,
            attributes: ["city_id", "city_name", "postal_code", "provinces_id"],
            include: [
              {
                model: db.tb_ro_provinces,
                attributes: ["province_name"],
              },
            ],
          },
        ],
        where: { transaction_uid: transaction_uid, users_id: id },
      });

      return order;
    } catch (error) {
      return error;
    }
  },
  orderDetailsByTransactionId: async (transaction_uid, id) => {
    try {
      const orderDetails = await db.orders_details.findAll({
        include: [
          {
            model: db.warehouses,
            attributes: ["name", "id"],
          },
          {
            model: db.products,
            attributes: ["id", "product_name", "product_price"],
            include: [
              {
                model: db.products_images,
                attributes: ["image"],
              },
            ],
          },
        ],
        where: { transaction_uid: transaction_uid, users_id: id },
      });

      return orderDetails;
    } catch (error) {
      return error;
    }
  },
  cancelOrderByTransactionId: async (id, transaction_uid) => {
    try {
      const cancelOrder = await db.orders_details.update(
        { status: "Order Canceled" },
        { where: { transaction_uid: transaction_uid, users_id: id } }
      );
      return cancelOrder;
    } catch (error) {
      return error;
    }
  },
  upload: async (id, transaction_uid, file) => {
    try {
      const upload = await db.orders.update(
        {
          payment_proof: file[0].path,
        },
        {
          where: { transaction_uid: transaction_uid, users_id: id },
        }
      );
      return upload;
    } catch (error) {
      return error;
    }
  },
  updateStatusAfterUpload: async (id, transaction_uid) => {
    try {
      const updateStatus = await db.orders_details.update(
        {
          status: "Waiting for Payment Approval",
        },
        { where: { users_id: id, transaction_uid: transaction_uid } }
      );
      return updateStatus;
    } catch (error) {
      return error;
    }
  },
  statusByTransactionId: async (transaction_uid, id) => {
    try {
      const status = await db.orders_details.findOne({
        attributes: ["status", "updatedAt"],
        where: { users_id: id, transaction_uid: transaction_uid },
      });

      return status;
    } catch (error) {
      return error;
    }
  },
  statusUpdateAfter15Mins: async (io, id) => {
    cron.schedule("* * * * *", async () => {
      try {
        const fifteenMinutesAgo = new Date();
        fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 2);

        const [affectedRowsCount] = await db.orders_details.update(
          { status: "Order Canceled" },
          {
            where: {
              users_id: id,
              createdAt: {
                [Op.lt]: fifteenMinutesAgo,
              },
              status: "Payment Pending",
            },
          }
        );
        console.log(affectedRowsCount);

        if (affectedRowsCount > 0) {
          io.to("Bp8n4Un8QR6X7RtTAAAC").emit("statusChange", {
            status: "Order Canceled",
          });
        }
      } catch (error) {
        console.error("Error cancelling orders:", error);
      }
    });
  },
  findAdminData: async (id) => {
    try {
      const adminData = await db.users.findByPk(id);
      return adminData;
    } catch (error) {
      return error;
    }
  },
  orderApproval: async (warehouses_id) => {
    try {
      console.log(warehouses_id);

      const data = await db.orders_details.findAll({
        where: {
          status: "Waiting for Payment Approval",
          warehouses_id: warehouses_id,
        },
        group: ["transaction_uid"],
      });
      return data;
    } catch (error) {
      return error;
    }
  },
  orderApprovalDetails: async (warehouses_id, transaction_uid) => {
    try {
      const data = await db.orders_details.findAll({
        attributes: [
          "id",
          "quantity",
          "transaction_uid",
          "products_id",
          "users_id",
          "warehouses_id",
        ],
        include: [
          {
            model: db.products,
            include: [
              {
                model: db.products_stocks,
                attributes: ["stock"],
                where: { warehouses_id: warehouses_id },
              },
              {
                model: db.products_images,
                attributes: ["image"],
              },
            ],
          },
        ],
        where: {
          status: "Waiting for Payment Approval",
          warehouses_id: warehouses_id,
          transaction_uid: transaction_uid,
        },
      });
      return data;
    } catch (error) {
      return error;
    }
  },

  orders: async (warehouses_id, transaction_uid) => {
    try {
      const order = await db.orders.findOne({
        attributes: [
          "id",
          "total_price",
          "transaction_uid",
          "payment_proof",
          "users_id",
          "warehouses_id",
        ],
        where: {
          transaction_uid: transaction_uid,
          warehouses_id: warehouses_id,
        },
      });
      return order;
    } catch (error) {
      return error;
    }
  },
  rejectOrder: async (transaction_uid, users_id) => {
    try {
      const reject = await db.orders_details.update(
        {
          status: "Payment Pending",
          createdAt: new Date(),
        },
        { where: { users_id: users_id, transaction_uid: transaction_uid } }
      );
      console.log(reject);
      return reject;
    } catch (error) {
      return error;
    }
  },
  getWarehouseData: async (warehouses_id, productId) => {
    try {
      const warehouse = await db.warehouses.findOne({
        include: [
          {
            model: db.products_stocks,
            where: { products_id: productId },
          },
        ],
        where: { id: warehouses_id },
      });
      return warehouse;
    } catch (error) {
      return error;
    }
  },
  getWarehouseTerdekat3: async (datas, ids) => {
    try {
      const data = await db.warehouses.findAll({
        where: {
          id: {
            [db.Sequelize.Op.notIn]: ids,
          },
          lat: {
            [Op.not]: datas.lat,
          },
          lng: {
            [Op.not]: datas.lng,
          },
        },
      });
      let nearestWarehouse = null;
      let nearestDistance = Infinity;
      function degToRad(deg) {
        return deg * (Math.PI / 180);
      }
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius bumi dalam kilometer
        const dLat = degToRad(lat2 - lat1);
        const dLon = degToRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degToRad(lat1)) *
            Math.cos(degToRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return Math.ceil(distance);
      }

      data.forEach((warehouse) => {
        const distance = calculateDistance(
          datas.lat,
          datas.lng,
          warehouse.lat,
          warehouse.lng
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestWarehouse = warehouse;
        }
      });

      return nearestWarehouse;
    } catch (error) {
      return error;
    }
  },
  updateStock: async (warehouses_id, productId, qty) => {
    try {
      const update = await db.products_stocks.update(
        {
          stock: sequelize.literal(`stock - ${qty}`),
        },
        {
          where: { products_id: productId, warehouses_id: warehouses_id },
        }
      );
      return update;
    } catch (error) {
      return error;
    }
  },
  createHistory: async (data) => {
    try {
      const create = await db.products_stocks_histories.create(data);
      return create;
    } catch (error) {
      return error;
    }
  },
  updateStatusAfterAccept: async (transaction_uid, users_id) => {
    try {
      const update = await db.orders_details.update(
        {
          status: "Order Process",
        },
        {
          where: { transaction_uid: transaction_uid, users_id: users_id },
        }
      );
    } catch (error) {
      return error;
    }
  },
  createStockMutation: async (data) => {
    try {
      const createMutation = await db.stocks_mutations.create(data);
      return createMutation;
    } catch (error) {
      return error;
    }
  },
  userRole: async (id) => {
    try {
      const role = await db.users.findByPk(id);
      return role;
    } catch (error) {
      return error;
    }
  },
  filterAdminOrders: async (
    status,
    warehouses_id,
    role,
    page,
    warehouses_id2
  ) => {
   let where = {};
    if (status) {
      where.status = status;
    }
    if (warehouses_id2 && role === "Owner") {
      where.warehouses_id = Number(warehouses_id2);
    }

    if (role === "Warehouse Admin") {
      where.warehouses_id = warehouses_id;
    }

    console.log(where);
    try {
      const limit = 8;
      if (role === "Warehouse Admin") {
        const filterPaymentStatusOrder = await db.orders_details.findAll({
          attributes: [
            "id",
            "transaction_uid",
            "quantity",
            "status",
            "createdAt",
            "updatedAt",
            "users_id",
            "warehouses_id",
            [
              db.Sequelize.fn("sum", db.Sequelize.col("product_price")),
              "total_price",
            ],
          ],
          include: [
            {
              model: db.warehouses,
              attributes: ["name"],
            },
          ],
          where,
          group: ["transaction_uid"],
          order: [["createdAt", "DESC"]],
        });
        return { data: filterPaymentStatusOrder };
      } else {
        const filterPaymentStatusOrder = await db.orders_details.findAll({
          attributes: [
            "id",
            "transaction_uid",
            "quantity",
            "status",
            "createdAt",
            "updatedAt",
            "users_id",
            "warehouses_id",
            [
              db.Sequelize.fn("sum", db.Sequelize.col("product_price")),
              "total_price",
            ],
          ],
          include: [
            {
              model: db.warehouses,
              attributes: ["name"],
            },
          ],
          where,
          group: ["transaction_uid"],
          order: [["createdAt", "DESC"]],
        });
        return { data: filterPaymentStatusOrder };
      }
    } catch (error) {
      return error;
    }
  },
  warehouses: async () => {
    try {
      const res = await db.warehouses.findAll();
      return res;
    } catch (error) {
      return error;
    }
  },
  completeOrder: async (transaction_uid, id) => {
    try {
      const res = await db.orders_details.update(
        {
          status: "Order Completed",
        },
        {
          where: { transaction_uid: transaction_uid, users_id: id },
        }
      );
      return res;
    } catch (error) {
      return error;
    }
  },
  productAllStock: async (id) => {
    try {
      const getProduct = await db.products.findOne({
        attributes: [
          [
            sequelize.fn("SUM", sequelize.literal("`products_stocks`.`stock`")),
            "totalStock",
          ],
        ],
        where: { id: id },
        include: [
          {
            model: db.products_stocks,
            attributes: ["stock"],
          },
        ],
      });
      return getProduct;
    } catch (error) {
      return error;
    }
  },
  adminListDelivery: async (warehouses_id) => {
    try {
      const res = await db.orders_details.findAll({
        where: { warehouses_id: warehouses_id, status: "Order Process" },
      });
      return res;
    } catch (error) {
      return error;
    }
  },
  sendPackage: async (transaction_uid, users_id) => {
    try {
      const res = await db.orders_details.update(
        {
          status: "Package Sent",
        },
        {
          where: { transaction_uid: transaction_uid, users_id: users_id },
        }
      );
    } catch (error) {
      return error;
    }
  },
};
