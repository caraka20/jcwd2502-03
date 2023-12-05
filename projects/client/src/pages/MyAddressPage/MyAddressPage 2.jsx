import { useEffect, useState } from "react";
import EditMyAddressModal from "../../components/EditMyAddressModal/EditMyAddressModal";
import axiosInstance from "../../config/api";
import toast from "react-hot-toast";
import Button from "../../components/Button/Button";
import { useSelector } from "react-redux";
import AddressTable from "../../components/AddressTable/AddressTable";

const MyAddressPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState([]);
    const [rajaOngkir, setRajaOngkir] = useState([]);
    const [onClick, setOnClick] = useState();
    const { id } = useSelector((state) => state.user);



    const getAddress = async () => {
        try {
            const getAddress = await axiosInstance.post("/order/address");
            setAddresses(getAddress.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getData = async () => {
        try {
            const getROProvinces = await axiosInstance.get(
                "/order/raja-ongkir-cities"
            );
            setRajaOngkir(getROProvinces.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleConfirmChangeAddress = async (value) => {
        try {
            if (!value) return toast.error("Please Select an Address");

            await axiosInstance.put(`/user/address`, {
                users_id: id,
                address_id: value.id,
            });

            setModalIsOpen(false);
            toast.success("Address successfully set as primary!");

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.log(error);
            toast.error("Failed Change Address");
        }
    };

    useEffect(() => {
        getData();
        getAddress();
    }, []);

    return (
        <>
            <div className="flex justify-center p-7">
                <Button
                    btnCSS="text-white h-[44px]  px-[100px] rounded-[4px]"
                    btnName="Add / Edit Address"
                    onClick={() => setModalIsOpen(true)}
                />
                <EditMyAddressModal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    handleConfirmChangeAddress={handleConfirmChangeAddress}
                    closeModal={() => setModalIsOpen(false)}
                    addresses={addresses}
                    setAddress={setAddress}
                    setOnClick={setOnClick}
                    onClick={onClick}
                    // userData={userData}
                    rajaOngkir={rajaOngkir}
                    setRajaOngkir={setRajaOngkir}
                    getAddress={getAddress}
                    setModalIsOpen={setModalIsOpen}
                />
            </div>
            <div>
            <AddressTable/>
            </div>
        </>
    );
};

export default MyAddressPage;
