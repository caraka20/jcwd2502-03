import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axiosInstance from "../../../config/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ModalEditStock = ({ onPress }) => {
  const [stock, setStock] = useState(JSON.parse(localStorage.getItem("stock")));
  const [input, setInput] = useState({
    quantity: null,
  });
  // console.log(stock.data[0].product.id);
  // console.log(stock.data[0].warehouse.id);
  // console.log(stock.data[0].stock);
  const handleChange = (e) => {
    let newData = { ...input };
    newData[e.target.name] = e.target.value;
    setInput(newData);
  };

  const tambahStock = async () => {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: true,
      });

      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "you want to Add Stock?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Add Stock!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const res = await axiosInstance.put(
          `/stock/tambah?warehouses_id=${stock.data[0].warehouse.id}&products_id=${stock.data[0].product.id}`,
          input
        );
        setTimeout(() => {
          swalWithBootstrapButtons.fire({
            title: "Succes!",
            text: "Success Add Stock",
            icon: "success",
          });
        }, 300);
        setTimeout(() => {
          window.location.reload();
        }, 700);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Add STock has been cancelled",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const kurangStock = async () => {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: true,
      });

      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "you want to reduce Stock?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reduce Stock!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const res = await axiosInstance.put(
          `/stock/kurang?warehouses_id=${stock.data[0].warehouse.id}&products_id=${stock.data[0].product.id}`,
          input
        );
        setTimeout(() => {
          swalWithBootstrapButtons.fire({
            title: "Succes!",
            text: "Success reduce Stock",
            icon: "success",
          });
        }, 300);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "reduce STock has been cancelled",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <>
        <ModalHeader className="flex flex-col gap-1">
          Total Stock : {stock.data[0].stock}
        </ModalHeader>
        <ModalBody>
          <input
            onChange={handleChange}
            value={input.quantity}
            name="quantity"
            type="number"
            placeholder="Masukan quantity"
            className="input input-bordered w-full max-w-xs"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={kurangStock}
            color="danger"
            variant="light"
            onPress={onPress}
          >
            Kurang Stock
          </Button>
          <Button
            onClick={tambahStock}
            color="danger"
            variant="light"
            onPress={onPress}
          >
            Tambah Stock
          </Button>
        </ModalFooter>
      </>
    </>
  );
};

export default ModalEditStock;
