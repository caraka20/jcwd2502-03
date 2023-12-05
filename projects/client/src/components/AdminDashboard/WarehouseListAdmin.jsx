import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../config/api";
import Input from "../Input/Input";
import NavAdmin from "./SidebarAdmin";
import Select from "react-select";
import Button from "../Button/Button";
import Swal from 'sweetalert2';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState(null);
  const [cities, setCities] = useState(null);
  const [prov, setProv] = useState(null);
  const [idUpdate, setIdUpdate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setDatas] = useState({
    name: "",
    cities_id: null,
    province_id: null,
  });
  const getWarehouse = async () => {
    try {
      const data = await axiosInstance.get(`/warehouse`);
      setWarehouses(data.data.data);
    } catch (error) {
      toast.error("error");
    }
  };

  const getCities = async () => {
    try {
      const res = await axiosInstance.get(
        `/rajaongkir?provinces_id=${data.province_id}`
      );
      const pro = await axiosInstance.get(`/rajaongkir/pro`);
      const formattedData = res.data.data.map((item) => ({
        value: item.city_id.toString(),
        label: item.city_name,
        name: "cities_id",
        province_id: item.province_id,
      }));
      const dataPro = pro.data.data.map((item) => ({
        value: item.province_id.toString(),
        label: item.province_name,
        name: "province_id",
      }));
      setProv(dataPro);
      setCities(formattedData);
    } catch (error) {
      console.log(error);
    }
  };
  const submitData = async () => {
    try {
      if (!idUpdate) {
        const res = await axiosInstance.post(`/warehouse`, { ...data });
        toast.success(res.data.message);
        setDatas({
          name: "",
          cities_id: null,
          province_id: null,
        });
        setSelectedOption(null);
      } else {
        const res = await axiosInstance.put(`/warehouse/${idUpdate}`, {
          name: data.name,
        });
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleEdit = async (e) => {
    try {
      setIdUpdate(e);
      const dataEdit = await axiosInstance.get(`/warehouse/${e}`);

      let newData = { ...data };
      newData["name"] = dataEdit.data.data.name;

      setDatas(newData);
    } catch (error) {
      toast.error("error");
    }
  };
  const handleChange = (e) => {
    let newData = { ...data };
    newData[e.name] = e.value;
    setDatas(newData);
  };
  const handleInput = (e) => {
    let newData = { ...data };
    newData[e.target.name] = e.target.value;
    setDatas(newData);
  };
  const handleBatal = async () => {
    setIdUpdate(null);
    setDatas({
      name: "",
      cities_id: null,
      province_id: null,
    });
  };
  const handleHapus = async (e) => {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: true
      });
  
      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "you want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      });
  
      if (result.isConfirmed) {
        const response = await axiosInstance.delete(`/warehouse/${e}`);
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
        getWarehouse();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Delete has been cancelled",
          icon: "error"
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  
  useEffect(() => {
    getWarehouse();
    getCities();
  }, [data, setDatas]);
  
  return (
    <div className="flex justify-center gap-5 max-w-[1280px] m-auto">
      {/* <NavAdmin /> */}
      <div className="px-2 max-w-[80%] max-h-[screen] mb-10 overflow-auto rounded-sm">
        <div className="">
          <span>Create Warehouse</span>
          <div>
            <label>Nama Warehouse</label>
            <Input
              inputCSS={""}
              placeholder={"nama warehouse ..."}
              value={data.name}
              onChange={handleInput}
              name={"name"}
            />
          </div>
          {!idUpdate && (
            <div>
              <label>Pilih Provinsi</label>
              <Select
                onChange={handleChange}
                options={prov}
                defaultValue={selectedOption}
              />
            </div>
          )}

          {data.province_id && (
            <div>
              <label>Pilih Kota </label>
              <Select
                onChange={handleChange}
                options={cities}
                defaultValue={selectedOption}
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={submitData}
              btnCSS={"rounded-md text-white font-semibold"}
              btnName={"Simpan"}
            />
            {idUpdate && (
              <Button
                onClick={handleBatal}
                btnCSS={"rounded-md text-white font-semibold"}
                btnName={"Batalkan"}
              />
            )}
          </div>
        </div>
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Warehouse</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Action</th>
              {/* ...Tambahkan header lain jika diperlukan */}
            </tr>
          </thead>
          <tbody>
            {warehouses?.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 cursor-pointer hover:underline">
                  {item.name}
                </td>
                <td className="border p-2">{item.city}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-sky-600 cursor-pointer font-semibold p-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleHapus(item.id)} className="bg-red-400 font-semibold cursor-pointer p-2 rounded-md">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseList;
