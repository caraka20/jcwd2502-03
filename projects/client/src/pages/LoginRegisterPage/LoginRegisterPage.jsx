import { useEffect, useState } from "react";
import TabBar from "../../components/TabBar/TabBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/Features/auth";

const LoginRegisterPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSignIn, setIsSignIn] = useState("block");
    const [isSignUp, setIsSignUp] = useState("hidden");
    const [state, setState] = useState({
        email: "",
        password: "",
    });
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    const userCookies = Cookies.get("user_token");

    useEffect(() => {
        if (userCookies) {
            navigate("/");
        }
    }, []);

    const handleChange = (e) => {
        const newState = { ...state };
        newState[e.target.name] = e.target.value;
        setState(newState);
    };

    const handleChangeRegister = (e) => {
        const newInput = { ...input };
        newInput[e.target.name] = e.target.value;
        setInput(newInput);
    };

    const loginMasuk = async (e) => {
        try {
            const { email, password } = state;
            const res = await axiosInstance.post("/auth/login", {
                email,
                password,
            });
            toast.success(res.data.message);
            console.log(res.data);
            Cookies.set("user_token", res.data.result.token);
            // console.log(res.data.result.user)
            dispatch(login(res.data.result.user));

            setTimeout(() => {
                if (res.data.result.user.role === "Owner") {
                    navigate("/admin/users");
                } else if (res.data.result.user.role === "Warehouse Admin") {
                    navigate("/admin/products");
                } else {
                    navigate("/");
                }
            }, 500);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const registerUser = async (e) => {
        try {
            const { fullname, email, password } = input;
            const res = await axiosInstance.post(`/auth/register`, {
                fullname,
                email,
                password,
            });
            toast.success(res.data.message);
            Cookies.set("user_token", res.data.result.loginToken);
            dispatch(login(res.data.result.user));
            setTimeout(() => {
                navigate("/");
            }, 500);

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleForgetPassword = () => {
        navigate("/forget-password");
    };

    const signIn = () => {
        setIsSignIn("block");
        setIsSignUp("hidden");
    };

    const signUp = () => {
        setIsSignIn("hidden");
        setIsSignUp("block");
    };

    const { fullname, email, avatar, status, is_verified } = useSelector(
        (state) => state.user
    );

    useEffect(() => {

    },[fullname])

    return (
        <div className="mt-[72px] px-[300px]">
            <TabBar />
            <div className=" flex flex-col bg-white w-full h-screen place-items-center pt-4">
                <div className="flex flex-col pb-2 mt-8 w-[424px] h-[504px] border-2 rounded">
                    <div className="flex flex-row justify-between border-b">
                        <div
                            className={
                                isSignIn === "block"
                                    ? "cursor-pointer font-bold w-full h-[50px] pl-14 pt-3 text-xl border-b-2 border-yellow-300"
                                    : "cursor-pointer font-bold w-full h-[50px] pl-14 pt-3 text-xl hover:bg-gray-100"
                            }
                            onClick={signIn}
                        >
                            Sign In
                        </div>
                        <div
                            className={
                                isSignUp === "block"
                                    ? "cursor-pointer font-bold w-full h-[50px] pl-14 pt-3 text-xl border-b-2 border-yellow-300"
                                    : "cursor-pointer font-bold w-full h-[50px] pl-14 pt-3 text-xl hover:bg-gray-100"
                            }
                            onClick={signUp}
                        >
                            Sign Up
                        </div>
                    </div>
                    <div className={`${isSignIn}`}>
                        <div className="pl-7 pt-7">
                            <div className="pb-3 text-sm">Email Address</div>
                            <input
                                className="border w-[365px] h-[50px] rounded-sm pl-3"
                                name="email"
                                value={state.email}
                                onChange={handleChange}
                                type="text"
                                placeholder="Your email..."
                            ></input>
                        </div>
                        <div className="pl-7 pt-7 pb-7">
                            <div className="flex flex-row justify-between pb-3">
                                <div className="text-sm">Password</div>
                                <div
                                    className="text-sm pr-7 text-blue-500 cursor-pointer"
                                    onClick={handleForgetPassword}
                                >
                                    Forget Password
                                </div>
                            </div>
                            <input
                                className="border w-[365px] h-[50px] rounded-sm"
                                type="password"
                                name="password"
                                value={state.password}
                                onChange={handleChange}
                                placeholder="Your password..."
                            ></input>
                        </div>
                        <div className="pl-7 pt-5 pb-5">
                            <button
                                className="border w-[365px] h-[50px] bg-orange-400 rounded-sm"
                                onClick={loginMasuk}
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="flex justify-center mb-4">
                            <div>or</div>
                        </div>
                        <div className="ml-7 mb-3 border w-[365px] h-[48px] rounded-sm flex flex-row">
                            <img
                                className="h-[48px] w-[80px]"
                                src="https://i.ibb.co/xsy9hV2/66904-logo-now-google-plus-home-free-png-hq.png"
                                alt="/"
                            />
                            <button className="pl-10">Login With Google</button>
                        </div>
                    </div>
                    <div className={`${isSignUp}`}>
                        <div className="pl-7 pt-7">
                            <div className="pb-3 text-sm">Full Name</div>
                            <input
                                className="border w-[365px] h-[50px] rounded-sm pl-3"
                                type="text"
                                name="fullname"
                                placeholder="Your full name..."
                                value={input.fullname}
                                onChange={handleChangeRegister}
                            ></input>
                        </div>
                        <div className="pl-7 pt-7">
                            <div className="pb-3 text-sm">Email</div>
                            <input
                                className="border w-[365px] h-[50px] rounded-sm pl-3"
                                type="text"
                                name="email"
                                placeholder="Your email..."
                                value={input.email}
                                onChange={handleChangeRegister}
                            ></input>
                        </div>
                        <div className="pl-7 pt-7">
                            <div className="pb-3 text-sm">Password</div>
                            <input
                                className="border w-[365px] h-[50px] rounded-sm"
                                type="password"
                                name="password"
                                placeholder="Your password..."
                                value={input.password}
                                onChange={handleChangeRegister}
                            ></input>
                        </div>
                        <div className="pl-7 pt-10 pb-5">
                            <button
                                className="border w-[365px] h-[50px] bg-orange-400 rounded-sm"
                                onClick={registerUser}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterPage;
