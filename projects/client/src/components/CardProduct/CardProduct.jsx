import React, { useState } from "react";
import product1 from "../../assets/product1.png";
import "./cardproduct.css";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineEye,
} from "react-icons/ai";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AxiosInstance } from "../../config/api";
import ModalShowProduct from "../ModalShowProduct/ModalShowProduct";
// import { Button } from "flowbite-react";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import { Card, CardHeader, Image, CardBody } from "@nextui-org/react";


const CardProduct = ({ data, addToCart }) => {
  const datas = data;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleModal = () => {
    if (modalIsOpen === false) {
      setModalIsOpen(true);
    } else if (modalIsOpen === true) {
      setModalIsOpen(false);
    }
  };



  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentData = datas?.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < datas.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (startIndex > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div
        className={
          datas && datas.length > 0
            ? `gap-2 w-full flex sm:grid sm:grid-cols-4 md:grid-cols-6 md:gap-10 flex-wrap justify-items-start items-stretch galeri sm:justify-start`
            : `flex justify-center align-middle galeri items-center gap-5`
        }
      >
        {datas && datas.length > 0 ? (
          currentData.map((item, index) => {
            return (

              <Card
                className="pb-4 w-[40%] sm:w-[23%] md:w-[23%] lg:w-[20%] xl:w-[17%]"
                isPressable
              >
                {/* <CardBody className=" overflow-visible py-2"> */}
                <Link className="" to={`/product/${item.id}`}>
                  <Image
                    alt="Card background"
                    className=" rounded-xl h-[230px] object-cover bg-slate-400 w-full gambar"
                    src={`${process.env.REACT_APP_IMAGE_SERVER_URL_IMAGE}${item.products_images[0].image.substring(
                      6
                    )}`}
                  />
                  {/* </CardBody> */}
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny overflow-hidden uppercase font-bold">
                      {item.product_name}
                    </p>
                    <small className="text-default-500">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.product_price)}
                    </small>
                    {/* <h4 className="font-bold text-large">TEST</h4> */}
                  </CardHeader>
                </Link>
              </Card>
            );
          })
        ) : (
          <div className=" text-center m-auto ">
            <h2 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h2>
            <p className="text-gray-600">
              Maaf, produk yang Anda cari tidak tersedia dalam kategori ini.
            </p>
          </div>
        )}
      </div>
      {datas && datas.length > itemsPerPage - 1 ? (
        <div className="mt-7 flex flex-wrap justify-center gap-3 mb-4 w-full">
          <button
            className=" text-primaryOrange flex justify-center items-center p-2 w-[40px] h-[40px]  border-2 border-primaryOrange rounded-full "
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <BsArrowLeft className="font-extrabold " />
          </button>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              { length: Math.ceil(datas.length / itemsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-[40px] h-[40px] flex items-center justify-center border-2 rounded ${
                    currentPage === i + 1 ? "bg-primaryOrange text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
          <button
            className=" text-primaryOrange flex justify-center items-center p-2 w-[40px] h-[40px]  border-2 border-primaryOrange rounded-full "
            onClick={nextPage}
            disabled={endIndex >= datas.length}
          >
            <BsArrowRight className="font-extrabold " />
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CardProduct;
