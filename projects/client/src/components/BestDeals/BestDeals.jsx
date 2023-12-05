import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight } from "react-icons/ai";
import CardProduct from '../CardProduct/CardProduct';
import { Link } from 'react-router-dom';
import axiosInstance from '../../config/api';

const BestDeals = () => {

  const [data, setData] = useState([])
  const getData = async () => {
    try {
      const res = await axiosInstance.get("/product")
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const sixTopProducts = data.slice(0, 5);

  useEffect(() => {
    getData()
  },[])

  return (
    <>
      <div className=' m-auto my-[20px] w-full grid mt-[20px] '>
        <div className='flex items-center justify-between p-[8px]'>
            <span className='py-[8px] font-semibold text-2xl'>Best Deals</span>
            <Link to={"/product?categori=&sortBy="} ><span className='text-[#2DA5F3] py-[8px]'>Browse All Product <AiOutlineArrowRight className='inline' /></span></Link>
        </div>
        <div className='w-full'>
            <div className='flex justify-center gap-2 flex-wrap mx-[20px]'>
            <CardProduct data={sixTopProducts} />
            </div>
        </div>
      </div>
    </>
  )
}

export default BestDeals
