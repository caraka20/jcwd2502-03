import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    getKeyValue,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/api";

export default function AddressTable() {
    const [page, setPage] = React.useState(1);
    const [address, setAddress] = useState([]);
    const { id } = useSelector((state) => state.user);

    const getUserAddress = async () => {
        try {
            const addresses = await axiosInstance.get(
                `/user/address/user=${id}`
            );
            const dataAsArray = Array.isArray(addresses.data.result)
                ? addresses.data.result
                : [addresses.data.result];
            setAddress(dataAsArray);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserAddress();
    }, [id]); // Trigger the effect whenever the user id changes

    const rowsPerPage = 4;

    const pages = Math.ceil(address.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return address.slice(start, end);
    }, [page, address]);



    return (
        <Table
            aria-label="Example table with client side pagination"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader>
                <TableColumn key="address">ADDRESS</TableColumn>
                <TableColumn key="primary">STATUS</TableColumn>
            </TableHeader>
            <TableBody items={items}>
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.address}</TableCell>
                        <TableCell>
                            {item.is_primary ? (
                                <span style={{ color: "green" }}>Primary</span>
                            ) : (
                                <span style={{ color: "red" }}>
                                    Not Primary
                                </span>
                            )}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
