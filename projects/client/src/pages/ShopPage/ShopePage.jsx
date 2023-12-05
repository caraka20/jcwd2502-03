import axios from "axios";
import React, { useEffect, useState } from "react";
import TabBar from "../../components/TabBar/TabBar";
import PageInfo from "../../components/PageInfo/PageInfo";
import Input from "../../components/Input/Input";
import { BiSearch } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import CardProduct from "../../components/CardProduct/CardProduct";
import ModalShowProduct from "../../components/ModalShowProduct/ModalShowProduct";
import axiosInstance from "../../config/api";
const ShopePage = () => {
  const nav = useNavigate();
  const [kategori, setKategori] = useState(null);
  const [datas, setDatas] = useState(null);

  const param = useLocation();
  const [currentCategory, setCurrentCategory] = useState(
    new URLSearchParams(param.search).get("categori")
  );
  const [filter, setFilter] = useState({
    sortBy: "",
  });
  const [searchProductName, setSearchProductName] = useState("")

  

 
  const getKategori = async () => {
    try {
      const res = await axiosInstance.get("/category");
      setKategori(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (e) => {
    try {
      const res = await axiosInstance.get(`/product${param.search}&search=${searchProductName}&sortBy=${filter.sortBy}&product_status=Active`
      );
      setDatas(res.data);

    } catch (error) {
      console.log(error);
    }
  };


  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = kategori.find((item) => {
      return item.id == selectedCategoryId;
    });

    if (selectedCategory) {
      nav(`/product?categori=${selectedCategory.category}`);
    } else {
      nav(`/product?categori=`);
      setCurrentCategory("");
    }
    setCurrentCategory(selectedCategory.category);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const newFilter = { ...filter };
    newFilter[e.target.name] = e.target.value;
    setFilter(newFilter);
  };

  useEffect(() => {
    getKategori();
    getProduct();
  }, [currentCategory, filter, filter]);
  return (
    <div className="max-w-[1280px] m-auto">
      <TabBar />

      <div className="flex flex-col flex-wrap gap-[24px] my-[40px] ">
        {/* sidebar filter start */}
        <div className="flex flex-col  justify-center md:flex-row flex-wrap gap-5 m-auto md:justify-between w-full">
          <div className="">
            <select
              className="select select-bordered w-full md:max-w-[312px]"
              onChange={handleCategoryChange}
            >
              <option disabled selected>
                {currentCategory ? currentCategory : "Pick Kategori"}
              </option>
              <option value={""}>All Product</option>
              {kategori &&
                kategori.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.category}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="flex rounded-md items-center gap-4 bg-white md:w-[50%] relative">
            <Input
              name={"searchProductName"}
              onChange={(e) => setSearchProductName(e.target.value)}
              placeholder={"Search Product..."}
              inputCSS={""}
            />
            <BiSearch
              type="submit"
              className="text-black right-2 cursor-pointer h-[32px] w-[32px] absolute"
              onClick={getProduct}
            />
          </div>
          <div className="">
            <select
              onChange={handleChange}
              name="sortBy"
              className="select select-bordered w-full md:max-w-[312px]"
            >
              <option disabled selected>
                Sort Price By
              </option>
              <option value="high_to_low">Tinggi Ke Rendah</option>
              <option value="low_to_high">Rendah Ke Tinggi</option>
            </select>
          </div>
        </div>
        {/* sidebar filter end */}

        {/* main shop start */}
        <div className="w-full m-auto">
          <CardProduct data={datas}  />
        </div>
        {/* main shop end */}

      </div>
    </div>
  );
};

export default ShopePage;
