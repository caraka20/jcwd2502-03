// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import toast from "react-hot-toast";
// import axiosInstance from "../../config/api";
// import ModalAddProduct from "./ComponentAdmin/ModalAddProduct";

// const CategoryAdmin = () => {
//   const [categories, setCategories] = useState([]);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const getKategori = async () => {
//     try {
//       const data = await axiosInstance.get(`/category`); // data kategori
//       const res = await axiosInstance.get(`/product`); // data product , product punya kategori_id
//       const categoryCounts = {};

//       for (const product of res.data) {
//         const categoryId = product.products_category.id; //2
//         if (categoryCounts[categoryId]) {
//           categoryCounts[categoryId]++;
//         } else {
//           categoryCounts[categoryId] = 1;
//         }
//       }
//       for (const product of res.data) {
//         const categoryId = product.products_categories_id;
//         product.total_product = categoryCounts[categoryId];
//       }

//       const categoryMap = new Map();
//       data.data.forEach((category) => {
//         categoryMap.set(category.id, category);
//       });

//       // Memindahkan nilai total product
//       res.data.forEach((product) => {
//         const categoryId = product.products_categories_id;
//         const category = categoryMap.get(categoryId);
//         if (category) {
//           category.total_product = product.total_product;
//         }
//       });
//       setCategories(data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const swalWithBootstrapButtons = Swal.mixin({
//         customClass: {
//           confirmButton: "btn btn-success",
//           cancelButton: "btn btn-danger",
//         },
//         buttonsStyling: true,
//       });

//       const result = await swalWithBootstrapButtons.fire({
//         title: "Are you sure?",
//         text: "you want to delete?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true,
//       });

//       if (result.isConfirmed) {
//         const response = await axiosInstance.delete(`/category/${id}`);
//         swalWithBootstrapButtons.fire({
//           title: "Deleted!",
//           text: response.data.message,
//           icon: "success",
//         });
//         getKategori();
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         swalWithBootstrapButtons.fire({
//           title: "Cancelled",
//           text: "Delete has been cancelled",
//           icon: "error",
//         });
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//         setModalIsOpen(true)
//         localStorage.setItem("kategori", id)
//     } catch (error) {
//         toast.error(error.response.data.message);
//     }
//   }
//   useEffect(() => {
//     getKategori();
//   }, []);
//   return (
//     <>
//       <ModalAddProduct
//         isOpen={modalIsOpen}
//         setModalIsOpen={setModalIsOpen}

//       />
//       <div className="overflow-x-auto mt-3">
//         <table className="table">
//           {/* head */}
//           <thead>
//             <tr>
//               <th>Category Name</th>
//               <th>Total Product</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* row  */}
//             {categories &&
//               categories.map((item, index) => {
//                 return (
//                   <tr>
//                     <td>
//                       <div className="flex items-center space-x-3">
//                         <div className="avatar">
//                           <div className="mask mask-squircle w-12 h-12">
//                             <img
//                               src={`http://localhost:8000${item.category_image.substring(
//                                 6
//                               )}`}
//                               alt="image"
//                             />
//                           </div>
//                         </div>
//                         <div>
//                           <div className="font-bold">{item.category}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>{item.total_product? item.total_product : "-" }</td>
//                     <td>
//                       <button onClick={() => handleEdit(item.id)} className=" btn-ghost btn-xs">Edit</button>
//                       <button onClick={() => handleDelete(item.id)} className=" btn-ghost btn-xs">Delete</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             <tr>
//               <td></td>
//               <td></td>
//               <td className="text-end">
//                 <button
//                   onClick={() => {
//                     setModalIsOpen(true);
//                   }}
//                   className=" btn-ghost btn-xs"
//                 >
//                   Add Category
//                 </button>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default CategoryAdmin;

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
import ModalAddProduct from "./ComponentAdmin/ModalAddProduct";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ModalAddCategory from "./ComponentAdmin/ModalAddCategory";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const columns = [
  { name: "CATEGORY", uid: "category" },
  { name: "TOTAL_PRODUCT", uid: "total_product" },
  { name: "ACTIONS", uid: "actions" },
];

export default function ProductsAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = React.useState("auto");

  const [categories, setCategories] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getKategori = async () => {
        try {
          const data = await axiosInstance.get(`/category?category_status=Active`); // data kategori
          const res = await axiosInstance.get(`/product?product_status=Active`); // data product , product punya kategori_id

          const categoryCounts = {};
          for (const product of res.data) {
            const categoryId = product.products_category.id && product.products_category.id; //2

            if (categoryCounts[categoryId]) {
              categoryCounts[categoryId]++;
            } else {
              categoryCounts[categoryId] = 1;
            }
          }
          for (const product of res.data) {
            const categoryId = product.products_category.id;
            product.total_product = categoryCounts[categoryId];
          }

          const categoryMap = new Map();
          data.data.forEach((category) => {
            categoryMap.set(category.id, category);
          });
    
          // Memindahkan nilai total product
          res.data.forEach((product) => {
            const categoryId = product.products_category.id;
            const category = categoryMap.get(categoryId);
            if (category) {
              category.total_product = product.total_product;
            }
          });

          setCategories(data.data);
        } catch (error) {
          console.log(error);
        }
      };

  useEffect(() => {
    getKategori();
  }, []);

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
        const response = await axiosInstance.delete(`/category/${id}`);
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: response.data.message,
          icon: "success",
        });
        getKategori()
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
      case "category":
        // user.products_images[0]
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `${
                process.env.REACT_APP_IMAGE_SERVER_URL_IMAGE
              }${user.category_image.substring(6)}`,
            }}
            // description={user.products_category.category}
            name={cellValue}
          >
            {/* {user.products_category.category} */}
          </User>
        );
      case "total_product":
        return (
          <div className="flex flex-col">
            <p className={`text-bold text-sm capitalize`}>
              {cellValue ? cellValue : "-"}
            </p>
            {/* <p className="text-bold text-sm capitalize text-default-400">{user.team}</p> */}
          </div>
        );
      case "actions":
        const onEdit = async (id) => {
          try {
            const hasil = await axiosInstance.get(`/product/${id}`)
            localStorage.setItem("kategori", JSON.stringify(hasil.data))

            onOpen()
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
              <span onClick={() => handleDelete(user.id)} className="text-xl text-danger cursor-pointer active:opacity-50">
                <MdDelete />
                {/* onClick={() => handleDelete(user.id)} */}
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
        <span>CATEGORY</span>
        <div className="flex flex-col gap-2">
          <Button onPress={onOpen} className="max-w-fit">
            Tambah Category
          </Button>
          <Modal
            isOpen={isOpen}
            placement={modalPlacement}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalAddCategory onPress={onClose} />
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
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={categories}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
