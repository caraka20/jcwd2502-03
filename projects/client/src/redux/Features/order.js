import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/api";
const initialState = {
  cart: [],
};

export const orderSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const getCartAsync = (data) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/order/cartdata");

    dispatch(setCart(res.data.data));
  } catch (error) {
    console.log(error);
  }
};

export const { setCart } = orderSlice.actions;

export default orderSlice.reducer;
