import React, { useEffect, useState } from "react";
import kategori1 from "../../assets/kategori1.png";
import axiosInstance from "../../config/api";
import { Link } from "react-router-dom";

const CardCategory = () => {
  const [categories, setCategories] = useState([]);
  const getKategori = async () => {
    try {
      const data = await axiosInstance.get(
        `http://localhost:8000/api/category`
      );
      setCategories(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKategori();
  }, []);
  return (
    <div className="flex flex-wrap wrapper  justify-center gap-2 mt-3">
      {categories &&
        categories.map((item, idx) => {
          return (
            <Link to={`/product?categori=${item.category}`}>
              <div className="max-w-[200px] overflow-hidden hover:shadow-lg hover:border-slate-400 rounded-md min-w-[180px] max-h-[236px] border cursor-pointer">
                <div className="">
                  <div className=" rounded-lg flex justify-center text-gray-950">
                    <img
                      className="max-h-[150px] w-full"
                      src={`http://localhost:8000${item.category_image.substring(
                        6
                      )}`}
                      alt=""
                    />
                  </div>
                  <div className=" max-w-[216px] mt-2 font-semibold mb-3 flex justify-center text-sm ">
                    {item.category}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default CardCategory;
