import React, { useEffect, useState } from "react";
import { ModalBody, Select, SelectItem, Input } from "@nextui-org/react";
import axiosInstance from "../../../config/api";
import { ModalHeader, ModalFooter, Button } from "@nextui-org/react";
import toast from "react-hot-toast";

const ModalAddProduct = ({ onPress }) => {
  const [product, setProduct] = useState(
    JSON.parse(localStorage.getItem("product"))
  );
  const [idEdit, setIdEdit] = useState(null);

  const [kategori, setKategori] = useState(null);
  const [data, setData] = useState({
    product_name: "",
    product_description: "",
    product_price: null,
    product_weight: null,
    products_categories_id: null,
  });
  const [images, setImages] = useState([]);

  const getKategori = async () => {
    const res = await axiosInstance.get("/category");
    setKategori(res.data);
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
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  };

  const handleSubmit = async () => {
    try {
      if (!idEdit) {
        const fd = new FormData();
        fd.append("data", JSON.stringify(data));
        images.forEach((value) => {
          fd.append("images", value);
        });
    
        const res = await axiosInstance.post(`/product`, fd);
        setTimeout(() => {
          toast.success(res.data.message);
        }, 500);
      } else {
        console.log("lala");
        const res = await axiosInstance.put(`/product/${idEdit}`, data);
        setTimeout(() => {
          toast.success(res.data.message);
        }, 300);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    getKategori();
    if (product) {
      setData(product[0]);
      setIdEdit(product[0].id);
      localStorage.removeItem("product");
    }
  }, []);
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Total Stock</ModalHeader>
      <ModalBody>
        <form action="" className="grid gap-4">
          <input
            onChange={handleChange}
            value={data.product_name}
            name="product_name"
            type="text"
            placeholder="Nama Product"
            className="input input-bordered w-full max-w-xs"
            id="nama_product"
          />
          <input
            onChange={handleChange}
            value={data.product_price}
            name="product_price"
            type="number"
            placeholder="Price"
            className="input input-bordered w-full max-w-xs"
            id=""
          />
          <input
            onChange={handleChange}
            value={data.product_weight}
            name="product_weight"
            type="number"
            placeholder="Product Weight"
            className="input input-bordered w-full max-w-xs"
            id=""
          />
          {!idEdit && (
            <input
              onChange={(e) => onSelectImages(e)}
              type="file"
              multiple="multiple"
              placeholder="Product Image"
              id=""
            />
          )}

          <div className="w-full flex flex-col gap-4">
            <div
              key={"sm"}
              className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
            >
              <Select
                size={"sm"}
                onChange={handleChange}
                name="products_categories_id"
                label={
                  product
                    ? product[0].products_category.category
                    : "Pilih Kategori"
                }
                className="max-w-xs"
                value={data.products_categories_id}
              >
                {kategori?.map((kategori) => (
                  <SelectItem key={kategori.id} value={kategori.id}>
                    {kategori.category}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          {/* <label for="nama_product">Product Description</label> */}
          <textarea
            value={data.product_description}
            onChange={handleChange}
            name="product_description"
            className="textarea textarea-bordered"
            placeholder="Deskripsi"
          ></textarea>
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

export default ModalAddProduct;
