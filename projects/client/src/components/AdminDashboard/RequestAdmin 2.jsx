import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
} from "@nextui-org/react";
import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react";
import axiosInstance from "../../config/api";
import { FaCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdDelete } from "react-icons/md";
import ModalAddProduct from "./ComponentAdmin/ModalAddProduct";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";

const statusColorMap = {
    Approved: "success",
    Pending: "danger",
};

const columns = [
    { name: "PRODUCT", uid: "product" },
    { name: "QUANTITY", uid: "quantity" },
    { name: "STATUS", uid: "status" },
    { name: "REQUEST WAREHOUSE", uid: "request_warehouses_id" },
    { name: "WAREHOUSE ADMIN", uid: "user" },
    { name: "ACTIONS", uid: "actions" },
];

export default function RequestAdmin() {
    const { role } = useSelector((state) => state.user);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [product, setProduct] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const getProduct = async () => {
        try {
            const res = await axiosInstance.get("/admin/mutations");
            console.log(res.data.result);
            setProduct(res.data.result);
        } catch (error) {
            console.log(error.response.data.message);
        }
    };
    useEffect(() => {
        getProduct();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentData = product?.slice(startIndex, endIndex);
    // console.log(currentData);

    const nextPage = () => {
        if (endIndex < product.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (startIndex > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAccept = async (id) => {
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
                text: "You want to accept stock mutation?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, accept it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                // const response = await axiosInstance.delete(`/product/${id}`);
                swalWithBootstrapButtons.fire({
                    title: "Accepted!",
                    text: "Success accept stock mutation!",
                    icon: "success",
                });
                getProduct();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Stock mutation has been cancelled!",
                    icon: "error",
                });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleDelete = async (id) => {
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
                text: "You want to decline stock mutation?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, decline it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                // const response = await axiosInstance.delete(`/product/${id}`);
                swalWithBootstrapButtons.fire({
                    title: "Declined!",
                    text: "Success decline stock mutation!",
                    icon: "success",
                });
                getProduct();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled!",
                    text: "Decline stock mutation has been cancelled!",
                    icon: "error",
                });
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];
        // {`http://localhost:8000${user.products_images[0].substring(6)}`}
        switch (columnKey) {
            case "product":
                // user.products_images[0]
                return (
                    <div>{user.product.product_name}</div>
                );
            case "quantity":
                return (
                    <div className="flex flex-col">
                        <p className={`text-bold text-sm capitalize`}>
                            {cellValue ? cellValue : "0"}
                        </p>
                        {/* <p className="text-bold text-sm capitalize text-default-400">{user.team}</p> */}
                    </div>
                );
            case "user":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue.fullname}
                        </p>
                    </div>
                );
            case "warehouse":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue.name}
                        </p>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[cellValue.status]}
                        size="sm"
                        variant="dot"
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                const onEdit = async (id) => {
                    try {
                        const hasil = await axiosInstance.get(`/product/${id}`);
                        localStorage.setItem(
                            "product",
                            JSON.stringify(hasil.data)
                        );
                        console.log(hasil.data);
                        onOpen();
                    } catch (error) {
                        console.log(error);
                    }
                };
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Accept">
                            <span
                                onClick={() => handleAccept(user.id)}
                                className="text-xl text-default-400 cursor-pointer active:opacity-50"
                            >
                                <FaCheckCircle />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Decline">
                            <span className="text-xl text-danger cursor-pointer active:opacity-50">
                                <ImCross
                                    onClick={() => handleDelete(user.id)}
                                />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between mx-3 my-3">
                <span>STOCK MUTATIONS</span>
                <div className="flex flex-col gap-2">
                    {role === "Owner" && (
                        <Button onPress={onOpen} className="max-w-fit">
                            Tambah Products
                        </Button>
                    )}
                    <Modal
                        isOpen={isOpen}
                        placement={modalPlacement}
                        onOpenChange={onOpenChange}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalAddProduct onPress={onClose} />
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div>
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={currentData}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {product && product.length > itemsPerPage - 1 ? (
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
                            {
                                length: Math.ceil(
                                    product.length / itemsPerPage
                                ),
                            },
                            (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-[40px] h-[40px] flex items-center justify-center border-2 rounded ${
                                        currentPage === i + 1
                                            ? "bg-primaryOrange text-white"
                                            : ""
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
                        disabled={endIndex >= product.length}
                    >
                        <BsArrowRight className="font-extrabold " />
                    </button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
