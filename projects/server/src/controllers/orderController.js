const {
  addTocart,
  getCartByProductId,
  addQuantityIfIdExist,
  getCartByUserId,
  deleteCart,
  getProductCartQty,
  updateQty,
  placementOrder,
  updateUid,
  getProductById,
  getAddessByUserId,
  getAddressByPrimaryKey,
  getRajaOngkir,
  paymentMethod,
  couriers,
  addAddressById,
  editAddress,
  getUserData,
  filterPaymentStatus,
  getWarehouseTerdekat2,
  createOrder,
  deleteCartProduct,
  orderByTransactionId,
  orderDetailsByTransactionId,
  cancelOrderByTransactionId,
  upload,
  updateStatusAfterUpload,
  statusByTransactionId,
  statusUpdateAfter15Mins,
  findAdminData,
  orderApproval,
  orderApprovalDetails,
  orders,
  rejectOrder,
  getWarehouseData,
  getWarehouseTerdekat3,
  updateStock,
  createHistory,
  updateStatusAfterAccept,
  createStockMutation,
  userRole,
  filterAdminOrders,
  warehouses,
  completeOrder,
  productAllStock,
  adminListDelivery,
  sendPackage,
} = require("./../services/orderService");

const { Op } = require("sequelize");
const cron = require("node-cron");
const sequelize = require("./../sequelizeInstance/sequelizeInstance");
const { getLatLong } = require("./../services/opencageService");
const { getShippingMethod } = require("./../services/rajaOngkirService");
const moment = require("moment");

const orderController = {
  addToCart: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;

      const { id } = req.tokens;

      const userData = await getUserData(id);

      if (userData.dataValues.is_verified === false) {
        throw {
          message: "Please verify your account to add items to the cart. ",
        };
      }

      const dataCart = await getCartByProductId({
        productId: productId,
        userId: id,
      });

      const getProductId = await getProductById(productId);
      let totalStock;

      if (getProductId) {
        totalStock = getProductId.dataValues.products_stocks.reduce(
          (acc, productStock) => acc + productStock.stock,
          0
        );
        console.log(totalStock);
      }
      if (quantity > totalStock) {
        throw {
          message: "Out of Stock / Quantity exceeds total stock",
        };
      }

      if (totalStock <= 0) {
        throw { message: "Out of stock" };
      }

      if (dataCart) {
        const addQuantity = await addQuantityIfIdExist(productId, quantity);

        res.status(200).send({
          isError: false,
          message: `Quantity Added by ${quantity}`,
        });
      } else {
        const addCart = await addTocart({
          products_id: productId,
          users_id: id,
          quantity: quantity,
        });

        res.status(200).send({
          isError: false,
          message: "Add to cart success",
          data: dataCart,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getCartData: async (req, res, next) => {
    try {
      const { id } = req.tokens;

      const dataCart = await getCartByUserId(id);

      const totalWeightForCart = dataCart.reduce((total, item) => {
        return Number(total) + Number(item.dataValues["total-weight"]);
      }, 0);

      res.status(200).send({
        isError: false,
        data: dataCart,
        totalWeight: totalWeightForCart,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteProductCart: async (req, res, next) => {
    const { productId } = req.body;
    const { id } = req.tokens;

    const destroy = await deleteCart({
      productId: productId,
      userId: id,
    });
    res.status(200).send({
      isError: false,
      message: "delete cart success",
    });
  },
  updateQuantityCart: async (req, res, next) => {
    try {
      const { quantity, productId } = req.body;
      const { id } = req.tokens;

      const updateQuantity = await updateQty({
        productId: productId,
        userId: id,
        quantity: quantity,
      });

      res.status(200).send({
        isError: false,
        message: "quantity updated",
        data: updateQuantity,
      });
    } catch (error) {
      next(error);
    }
  },
  placementOrder: async (req, res, next) => {
    try {
      const {
        cartProducts,
        weight,
        shippingType,
        delivery_fee,
        payment_method,
        courier,
        address_detail,
        warehouses_id,
        total_price,
        city_id,
      } = req.body;
      const { id } = req.tokens;
      const io = req.io;

      if (cartProducts.length === 0) throw { message: "Please add an item " };

      const result = await sequelize.transaction(async (t) => {
        const maps = await Promise.all(
          cartProducts.map(async (value) => {
            try {
              const checkStock = await productAllStock(value.products_id);

              if (checkStock.dataValues.totalStock < value.quantity) {
                throw {
                  message: `Sorry, the item "${value.product.product_name}" is out of stock`,
                };
              }

              console.log(checkStock);

              return {
                quantity: value.quantity,
                product_price: value.total,
                transaction_uid: null,
                users_id: id,
                warehouses_id: warehouses_id,
                products_id: value.products_id,
              };
            } catch (error) {
              throw error;
            }
          })
        );

        const placeOrder = await placementOrder(maps, { transaction: t });

        const formattedDate = moment(placeOrder[0].createdAt).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        const formattedTransactionUid = moment(
          formattedDate,
          "YYYY-MM-DD HH:mm:ss"
        ).format("YYYYMMDDHHmmss");

        const updateTransactionUid = await updateUid(
          formattedDate,
          `INV-${formattedTransactionUid}`,
          { transaction: t }
        );

        const warehouse_id = maps.map((value) => {
          return {
            warehouse_id: value.warehouses_id,
          };
        });

        return {
          result: `INV-${formattedTransactionUid}`,
          warehouse_id: warehouse_id,
        };
      });

      const data = {
        total_price: total_price,
        transaction_uid: result.result,
        payment_methods_id: payment_method,
        total_weight: weight,
        shipping_type: shippingType,
        delivery_fee: delivery_fee,
        users_id: id,
        courier: courier,
        address_detail: address_detail,
        warehouses_id: warehouses_id,
        customer_cities_id: city_id,
      };

      const order = await createOrder(data);

      const deleteCart = await deleteCartProduct(id);

      const adminSocket = req.adminSocket;

      const sendToAdmin = result.warehouse_id.map((value) => {
        const adminId = adminSocket.get(value.warehouse_id);
        console.log(adminId);
        return io
          .to(adminId)
          .emit("newOrder", { message: "New Order Available !" });
      });

      res.status(200).send({
        isError: false,
        message: "Congratulations! Your order has been successfully placed.",
        result: order,
      });
    } catch (error) {
      next(error);
    }
  },
  address: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const getAddress = await getAddessByUserId(id);
      console.log(getAddress);

      res.status(200).send({
        isError: false,
        data: getAddress,
        message: "Addresses found",
      });
    } catch (error) {
      next(error);
    }
  },
  primaryAddress: async (req, res, next) => {
    try {
      const { primary } = req.body;
      const { id } = req.tokens;

      const getAddress = await getAddressByPrimaryKey({
        id: id,
        primary: primary,
      });
      console.log(getAddress);

      res.status(200).send({
        isError: false,
        data: getAddress,
        message: "Primary address found",
      });
    } catch (error) {
      next(error);
    }
  },
  getCityRajaOngkir: async (req, res, next) => {
    try {
      const getCityRajaOngkir = await getRajaOngkir();

      res.status(200).send({
        isError: false,
        data: getCityRajaOngkir,
        message: "Raja ongkir cities found",
      });
    } catch (error) {
      next(error);
    }
  },
  paymentMethod: async (req, res, next) => {
    try {
      const getPaymentMethod = await paymentMethod();

      res.status(200).send({
        isError: false,
        data: getPaymentMethod,
      });
    } catch (error) {
      next(error);
    }
  },
  getCouriers: async (req, res, next) => {
    try {
      const getCouriers = await couriers();

      res.status(200).send({
        isError: false,
        data: getCouriers,
      });
    } catch (error) {
      next(error);
    }
  },
  addAddress: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { address, city } = req.body;

      if (!address) throw { message: "Fill Out The Address" };
      if (!city) throw { message: "Select The City" };

      const data = {
        address: address,
        cities_id: city,
        users_id: id,
      };

      const addAddress = await addAddressById(data);

      res.status(200).send({
        isError: false,
        data: addAddress,
        message: "Address Added",
      });
    } catch (error) {
      next(error);
    }
  },
  editAddress: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      console.log(id);
      const { address, city, idAddress } = req.body;
      const dataToEdit = {
        address: address,
        cities_id: city,
      };

      if (!address) throw { message: "Fill Out The Address" };
      if (!city) throw { message: "Select The City" };

      const resultEdit = await editAddress(dataToEdit, idAddress, id);

      res.status(200).send({
        isError: false,
        message: "Edit Successfull",
      });
    } catch (error) {
      next(error);
    }
  },
  getShippingMethod: async (req, res, next) => {
    try {
      const { cities_id, weight, courier } = req.body;

      if (!courier) throw { message: "Select a Courier" };
      if (courier === "select a courier") throw { message: "Select a Courier" };

      const userAddressLatLong = await getLatLong(cities_id);

      const nearestWarehouse = await getWarehouseTerdekat2(userAddressLatLong);
      console.log(nearestWarehouse);

      const data = {
        userCity: cities_id.toString(),
        nearestWarehouse: nearestWarehouse.cities_id.toString(),
        weight: weight > 30000 ? 30000 : weight,
        courier: courier.toString(),
      };

      const getShipping = await getShippingMethod(data);

      res.status(200).send({
        isError: false,
        data: getShipping.rajaongkir.results,
        nearestWarehouse: nearestWarehouse,
      });
    } catch (error) {
      next(error);
    }
  },
  getUserData: async (req, res, next) => {
    try {
      const { id } = req.tokens;

      const dataUser = await getUserData(id);

      res.status(200).send({
        isError: false,
        data: dataUser,
      });
    } catch (error) {
      next(error);
    }
  },
  filterOrder: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const filterOrders = await filterPaymentStatus(req.query, id);

      res.status(200).send({
        isError: false,
        data: filterOrders,
      });
    } catch (error) {
      next(error);
    }
  },
  OrderDetailsByTransactionId: async (req, res, next) => {
    try {
      const { transaction_uid, users_id } = req.body;
      const { id } = req.tokens;

      const userId = users_id ? users_id : id;
      const order = await orderByTransactionId(transaction_uid, userId);
      const orderDetails = await orderDetailsByTransactionId(
        transaction_uid,
        userId
      );

      res.status(200).send({
        isError: false,
        order: order,
        orderDetails: orderDetails,
      });
    } catch (error) {
      next(error);
    }
  },
  cancelOrder: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { transaction_uid } = req.body;

      const cancel = await cancelOrderByTransactionId(id, transaction_uid);

      res.status(200).send({
        isError: false,
        message: "The Order Has been Canceled",
      });
    } catch (error) {
      next(error);
    }
  },
  uploadPaymentAproval: async (req, res, next) => {
    try {
      const { transaction_uid } = JSON.parse(req.body.data);
      const { id } = req.tokens;
      const file = req.files.images;

      const status = await statusByTransactionId(transaction_uid, id);

      if (status.dataValues.status === "Order Canceled") {
        throw { message: "Order Has Been Canceled" };
      }

      const uploadImage = await upload(id, transaction_uid, file);
      const updateStatus = await updateStatusAfterUpload(id, transaction_uid);

      const dataOrder = await orderByTransactionId(transaction_uid, id);

      const warehouseId = dataOrder.dataValues.warehouses_id;
      const adminSocket = req.adminSocket;

      const admin = adminSocket.get(warehouseId);
      const io = req.io;

      if (admin) {
        const result = admin.map((value) => {
          return io.to(value).emit("upload", {
            message: "New Payment Approval Available !",
          });
        });
      }

      res.status(200).send({
        isError: false,
        message: "Submit Payment Success",
      });
    } catch (error) {
      res.status(400).send({
        isError: true,
        message: error.message,
      });
    }
  },
  statusOrder: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { transaction_uid, users_id } = req.body;

      const userId = users_id ? users_id : id;

      const status = await statusByTransactionId(transaction_uid, userId);
      res.status(200).send({
        isError: false,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  },
  adminOrderAprroval: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const adminData = await findAdminData(id);

      console.log(adminData);
      const orderApprovalData = await orderApproval(
        adminData.dataValues.warehouses_id
      );

      res.status(200).send({
        isError: false,
        data: orderApprovalData,
      });
    } catch (error) {
      next(error);
    }
  },
  adminOrderAprrovalDetails: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { transaction_uid } = req.body;
      const adminData = await findAdminData(id);

      const adminOrdersApproval = await orders(
        adminData.dataValues.warehouses_id,
        transaction_uid
      );
      const adminOrdersApprovalDetails = await orderApprovalDetails(
        adminData.dataValues.warehouses_id,
        transaction_uid
      );

      res.status(200).send({
        isError: false,
        orders: adminOrdersApproval,
        ordersDetails: adminOrdersApprovalDetails,
      });
    } catch (error) {
      next(error);
    }
  },
  rejectOrder: async (req, res, next) => {
    try {
      const { transaction_uid, users_id } = req.body;
      const reject = await rejectOrder(transaction_uid, users_id);
      const dataOrder = await orderByTransactionId(transaction_uid, users_id);

      const io = req.io;
      const customerSocket = req.customerSocket;

      const userId = customerSocket.get(users_id);

      if (userId) {
        userId.map((value) => {
          return io.to(value).emit("reject", {
            message:
              "Your order has been rejected. Please upload a new payment proof.",
          });
        });
      }

      res.status(200).send({
        isError: false,
        message: "Reject Order Success",
      });
    } catch (error) {
      next(error);
    }
  },
  confirmOrderAdmin: async (req, res, next) => {
    try {
      const { users_id, products } = req.body;

      const result = await sequelize.transaction(async (t) => {
        const checkStock = products.map(async (value) => {
          const updateStatus = await updateStatusAfterAccept(
            value.transaction_uid,
            users_id
          );
          let nearestWarehouse;
          let count = null;
          const ids = [];
          const qty = value.product.products_stocks[0].stock - value.quantity;

          if (qty >= 0) {
            const updatedQty = await updateStock(
              value.warehouses_id,
              value.products_id,
              value.quantity
            );

            const data = {
              status: "Berkurang",
              reference: value.transaction_uid,
              products_id: value.products_id,
              warehouses_id: value.warehouses_id,
              quantity: value.quantity,
            };
            console.log(value);

            const createStockHistories = await createHistory(data);
            // const updateStatus = await updateStatusAfterAccept(
            //   value.transaction_uid,
            //   users_id
            // );
          } else {
            while (true) {
              const lat = await getLatLong(value.warehouses_id);

              nearestWarehouse = await getWarehouseTerdekat3(lat, ids);

              const warehouseData2 = await getWarehouseData(
                nearestWarehouse.dataValues.id,
                value.products_id
              );

              if (
                warehouseData2.dataValues.products_stocks[0].stock -
                  value.quantity >=
                0
              ) {
                // warehouse yg ke 1
                const updatedQty = await updateStock(
                  ids[0],
                  value.products_id,
                  value.product.products_stocks[0].stock
                );
                let warehouse1;
                let warehouse3;

                if (ids.length > 0) {
                  warehouse1 = {
                    status: "Bertambah",
                    reference: value.transaction_uid,
                    products_id: value.products_id,
                    warehouses_id: ids[0],
                    quantity:
                      value.quantity - value.product.products_stocks[0].stock,
                  };
                  warehouse3 = {
                    status: "Berkurang",
                    reference: value.transaction_uid,
                    products_id: value.products_id,
                    warehouses_id: ids[0],
                    quantity: value.quantity,
                  };
                } else {
                  warehouse1 = {
                    status: "Bertambah",
                    reference: value.transaction_uid,
                    products_id: value.products_id,
                    warehouses_id: value.warehouses_id,
                    quantity:
                      value.quantity - value.product.products_stocks[0].stock,
                  };
                  warehouse3 = {
                    status: "Berkurang",
                    reference: value.transaction_uid,
                    products_id: value.products_id,
                    warehouses_id: value.warehouses_id,
                    quantity: value.quantity,
                  };
                }
                //warehouse yg ke 2
                const updatedNearestQty = await updateStock(
                  warehouseData2.dataValues.id,
                  value.products_id,
                  qty * -1
                );

                const warehouse2 = {
                  status: "Berkurang",
                  reference: value.transaction_uid,
                  products_id: value.products_id,
                  warehouses_id: warehouseData2.dataValues.id,
                  quantity:
                    value.quantity - value.product.products_stocks[0].stock,
                };
                const berkurangWarehouse2 = await createHistory(warehouse2);
                const bertambahWarehouse1 = await createHistory(warehouse1);
                const berkurangStockWarehouse1 = await createHistory(
                  warehouse3
                );

                // const updateStatus = await updateStatusAfterAccept(
                //   value.transaction_uid,
                //   users_id
                // );

                console.log(warehouseData2);
                console.log(ids);

                const data = {
                  quantity:
                    value.quantity - value.product.products_stocks[0].stock,
                  status: "Approved",
                  users_id: users_id,
                  request_warehouses_id: ids[0],
                  sender_warehouses_id: warehouseData2.dataValues.id,
                };

                const createMutation = await createStockMutation(data);
                break;
              }
              ids.push(value.warehouses_id);
              value.warehouses_id = nearestWarehouse.dataValues.id;
            }
          }
        });
        return { message: "success" };
      });

      const io = req.io;

      const customerSocket = req.customerSocket;

      const customerId = customerSocket.get(users_id);
      console.log(customerId);
      if (customerId) {
        const id = customerId.map((value) => {
          io.to(value).emit("accept", {
            message: "Order Accepted",
          });
        });
      }

      res.status(200).send({
        isError: false,
        message: "Order Accept",
      });
    } catch (error) {
      next(error);
    }
  },
  adminFilterOrders: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { role, page } = req.body;

      const userData = await userRole(id);

      const filterOrders = await filterAdminOrders(
        req.query.status,
        userData.dataValues.warehouses_id,
        userData.dataValues.role,
        page,
        req.query.warehouses_id
      );


      res.send({
        isError: false,
        data: filterOrders.data,
        maxPages: filterOrders.maxPages,
      });
    } catch (error) {
      next(error);
    }
  },
  warehouseData: async (req, res, next) => {
    try {
      const warehouseData = await warehouses();

      res.send({
        isError: false,
        data: warehouseData,
      });
    } catch (error) {
      next(error);
    }
  },
  role: async (req, res, next) => {
    try {
      const { id } = req.tokens;

      const role = await userRole(id);

      res.send({
        isError: false,
        data: role.dataValues.role,
      });
    } catch (error) {
      next(error);
    }
  },
  handleOrderComplete: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { transaction_uid } = req.body;

      const handleCompleOrder = await completeOrder(transaction_uid, id);
      console.log(handleCompleOrder);

      const dataOrder = await orderByTransactionId(transaction_uid, id);
      const adminSocket = req.adminSocket;
      const warehouseId = dataOrder.dataValues.warehouses_id;
      const admin = adminSocket.get(warehouseId);
      const io = req.io;

      if (admin) {
        const result = admin.map((value) => {
          return io.to(value).emit("order complete", {
            message: "Order Has Been Completed",
            transaction_uid: transaction_uid,
          });
        });
      }

      res.send({
        isError: false,
        message: "Order Completed",
      });
    } catch (error) {
      next(error);
    }
  },
  adminOrderDeliveryList: async (req, res, next) => {
    try {
      const { id } = req.tokens;

      const userData = await getUserData(id);

      const getListDelivery = await adminListDelivery(
        userData.dataValues.warehouses_id
      );

      res.send({
        isError: false,
        data: getListDelivery,
      });
    } catch (error) {
      next(error);
    }
  },
  adminSendPackage: async (req, res, next) => {
    try {
      const { id } = req.tokens;
      const { transaction_uid, users_id } = req.body;

      const send = await sendPackage(transaction_uid, users_id);

      const io = req.io;
      const customerSocket = req.customerSocket;

      const userId = customerSocket.get(users_id);

      if (userId) {
        userId.map((value) => {
          return io.to(value).emit("Package Sent", {
            message: "Your package has been sent",
            transaction_uid: transaction_uid,
          });
        });
      }

      res.status(200).send({
        isError: false,
        message: "Package has been sent",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
