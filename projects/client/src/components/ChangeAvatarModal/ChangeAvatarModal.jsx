import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/api";
import toast from "react-hot-toast";

export default function ChangeAvatarModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { id } = useSelector((state) => state.user);

    const [images, setImages] = useState([]);

    const onSelectImages = (e) => {
        try {
            const selectedImage = e.target.files[0];

            if (selectedImage.size > 2000000)
                throw {
                    message: `${selectedImage.name} size must be below 2 MB.`,
                };

            if (selectedImage.type.split("/")[0] !== "image") {
            }

            setImages(selectedImage);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    const changeAvatar = async (e) => {
        try {
            const fd = new FormData();
            fd.append("images", images);


            const res = await axiosInstance.post(`/user/avatar`, fd);

            toast.success(res.data.message);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <Button onClick={() => onOpen()} color="primary">
                Change your avatar
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Please select a file
                            </ModalHeader>
                            <ModalBody>
                                {/* <input
                                    className="border rounded-xl"
                                    name="fullname"
                                    value={input.fullname}
                                    onChange={handleChangeFullname}
                                    type="text"
                                    placeholder="Enter your new fullname here..."
                                /> */}
                                <input
                                    onChange={(e) => onSelectImages(e)}
                                    type="file"
                                    multiple="multiple"
                                    placeholder="Product Image"
                                    id=""
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    onPress={onClose}
                                    onClick={() => changeAvatar()}
                                >
                                    Change your avatar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
