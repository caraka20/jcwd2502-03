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
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import AdminEditUserModal from "../AdminEditUserModal/AdminEditUserModal";

const statusColorMap = {
    Active: "success",
    Inactive: "danger",
    true: "success",
    false: "danger",
};

const columns = [
    { name: "FULLNAME", uid: "fullname" },
    { name: "EMAIL", uid: "email" },
    { name: "ACCOUNT STATUS", uid: "status" },
    { name: "VERIFICATION STATUS", uid: "is_verified" },
    { name: "WAREHOUSE LOCATION", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
];

export default function UserListTable() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalPlacement, setModalPlacement] = React.useState("auto");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [product, setProduct] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const getProduct = async () => {
        try {
            const res = await axiosInstance.get("/admin/users");
            const dataAsArray = Array.isArray(res.data.result)
                ? res.data.result
                : [res.data.result];

            const wdata = await axiosInstance.get(`/warehouse`);

            const newData = dataAsArray.map((value) => {
                const data = wdata.data.data.find(
                    (item) => item.id === value.warehouses_id
                );
                return {
                    ...value,
                    name: data ? data.name : null,
                };
            });

            // console.log(newData)
            setProduct(newData);


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
                text: "you want to delete?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                const response = await axiosInstance.delete(
                    `/admin/delete-user/${id}`
                );
                swalWithBootstrapButtons.fire({
                    title: "User Deleted!",
                    text: response.data.message,
                    icon: "success",
                });
                getProduct();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Delete has been cancelled",
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
            case "fullname":
                // user.products_images[0]
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            src: `http://localhost:8000${
                                user.avatar && user.avatar.substring(6)
                            }`,
                        }}
                        description={user.role}
                        name={cellValue}
                    >
                        {user.role}
                    </User>
                );
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className={`text-bold text-sm capitalize`}>
                            {cellValue ? cellValue : "-"}
                        </p>
                        {/* <p className="text-bold text-sm capitalize text-default-400">{user.team}</p> */}
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.status]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "is_verified":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.is_verified]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue ? "Verified" : "Not Verified"}
                    </Chip>
                );
            case "name":
                return (
                    <Chip className="capitalize" size="sm" variant="">
                        {cellValue ? cellValue : "-"}
                    </Chip>
                );
            case "actions":
                const onEdit = async (id) => {
                    try {
                        const hasil = await axiosInstance.get(`/admin/user/${id}`);
                        localStorage.setItem(
                            "user",
                            JSON.stringify(hasil.data)
                        );

                        onOpen();
                    } catch (error) {
                        console.log(error);
                    }
                };
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Edit user">
                            <span
                                onClick={() => onEdit(user.id)}
                                className="text-xl text-default-400 cursor-pointer active:opacity-50"
                            >
                                <FaRegEdit />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <span className="text-xl text-danger cursor-pointer active:opacity-50">
                                <MdDelete
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
                <span>User List</span>
                <div className="flex flex-col gap-2">
                    <Modal
                                    isOpen={isOpen}
                                    placement={modalPlacement}
                                    onOpenChange={onOpenChange}
                                >
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <AdminEditUserModal
                                                    onPress={onClose}
                                                />
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
                <>lala</>
            )}
        </div>
    );
}
