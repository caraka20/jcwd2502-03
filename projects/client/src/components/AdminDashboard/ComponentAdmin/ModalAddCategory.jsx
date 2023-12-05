import React, { useEffect, useState } from "react";
// import Button from "../../Button/Button";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ModalBody, Select, SelectItem, Input } from "@nextui-org/react";
import axiosInstance from "../../../config/api";
import { ModalHeader, ModalFooter, Button } from "@nextui-org/react";
import toast from "react-hot-toast";
const ModalAddCategory = ({ onPress }) => {
  const [input, setInput] = useState({
    category: "",
  });
  const [dataKategori, setDataKategori] = useState({
    category: "",
  });
  // const [idEdit, setIdEdit] = useState(null);
  const [idKategori, setIdKategory] = useState(null);
  const [images, setImages] = useState([]);
  const nav = useNavigate();
  const getKategori = async () => {
    try {
      const idKategori = localStorage.getItem("kategori");
      setIdKategory(idKategori);
      const res = await axiosInstance.get(`/category/${idKategori}`);

      setInput({
        category: res.data.category,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const onSelectImages = (event) => {
    try {
      const files = [...event.target.files];
      files.forEach((value) => {
        if (value.size > 10000000)
          throw {
            message: `${value.name} Size Harus Dibawah 1MB`,
          };
        if (value.type.split("/")[0] !== "image") {
          throw {
            message: `${value.name} Harus Gambar`,
          };
        }
      });
      setImages(files);
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    let newInput = { ...input };
    newInput[e.target.name] = e.target.value;
    setInput(newInput);
  };

  const handleClose = () => {
    localStorage.removeItem("kategori");
    // isOpen = false;
    // setModalIsOpen(false);
  };

  const handleSubmit = async () => {
    try {
      // if (!idKategori) {

        const fd = new FormData();
        fd.append("data", JSON.stringify(input));
        images.forEach((value) => {
          fd.append("images", value);
        });

        const res = await axiosInstance.post(`/category`, fd);
        setTimeout(() => {
          toast.success(res.data.message);
        }, 500);
        //   handleClose();
        setTimeout(() => {
          window.location.reload();
          // nav("/admin/category")
        }, 2000);
        // localStorage.removeItem("kategori");
      // } else {
      //   // console.log("lala");
      //   const res = await axiosInstance.put(`/category/${idKategori}`, input);
      //   setTimeout(() => {
      //     toast.success(res.data.message);
      //   }, 500);
      //   //   handleClose();
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 1000);
      //   localStorage.removeItem("kategori");
      // }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };


  useEffect(() => {
    getKategori();
    // if (dataKategori) {
    //   setData(product[0]);
    //   setIdEdit(product[0].id);
    //   localStorage.removeItem("product");
    // }
  }, []);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Tambah Product</ModalHeader>
      <ModalBody>
        <form action="" className="grid gap-4">
          <input
            onChange={handleChange}
            value={input.category}
            name="category"
            type="text"
            placeholder="Nama category"
            className="input input-bordered w-full max-w-xs"
            id="nama_product"
          />
          {(
            <input
              onChange={(e) => onSelectImages(e)}
              type="file"
              multiple="multiple"
              placeholder="Product Image"
              id=""
            />
          )}

        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onPress}>
          Close
        </Button>
        <Button color="primary" onClick={handleSubmit} onPress={onPress}>
          Simpan
        </Button>
      </ModalFooter>
    </>
  );
};

export default ModalAddCategory;
