import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../redux/store";
import { fetchData, fetchSingleProduct } from "../redux/slices/products/productSlice";
import {fetchCategory} from "../redux/slices/products/categorySlice"
import { fetchOrders } from "../redux/slices/products/orderSlice";
 
type FeatchProductsPendingAction = ReturnType<typeof fetchData.pending>;
type FeatchProductsFulfilledAction = ReturnType<typeof fetchData.fulfilled>;
type FeatchProductsErrorAction = ReturnType<typeof fetchData.rejected>;

type FeatchSingleProductPendingAction = ReturnType<typeof fetchSingleProduct.pending>;
type FeatchSingleProductFulfilledAction = ReturnType<typeof fetchSingleProduct.fulfilled>;
type FeatchSingleProductErrorAction = ReturnType<typeof fetchSingleProduct.rejected>;

type FeatchCategoryPendingAction = ReturnType<typeof fetchCategory.pending>;
type FeatchCategoryFulfilledAction = ReturnType<typeof fetchCategory.fulfilled>;
type FeatchCategoryErrorAction = ReturnType<typeof fetchCategory.rejected>;

type FeatchOrderPendingAction = ReturnType<typeof fetchOrders.pending>;
type FeatchOrderFulfilledAction = ReturnType<typeof fetchOrders.fulfilled>;
type FeatchOrderErrorAction = ReturnType<typeof fetchOrders.rejected>;

type ProductSearchAction = {
    type: 'product/searchProduct';
    payload: string;
 }
 type UserSearchAction = {
   type: 'user/searchUser';
   payload: string;
}
 type ProductSortAction = {
    type: 'product/sortProduct';
    payload: string;
 }


export type ProductAction =
  |FeatchProductsPendingAction
  |FeatchProductsFulfilledAction
  |FeatchProductsErrorAction
  |FeatchSingleProductPendingAction
  |FeatchSingleProductFulfilledAction
  |FeatchSingleProductErrorAction
  |ProductSearchAction
  |ProductSortAction
  |UserSearchAction
  |FeatchCategoryPendingAction
  |FeatchCategoryFulfilledAction
  |FeatchCategoryErrorAction;

export type OrderActions = 
|FeatchOrderPendingAction
|FeatchOrderFulfilledAction
|FeatchOrderErrorAction;

export type ProductsDispatch = ThunkDispatch<RootState, void, ProductAction>;
export type OrderDispatch = ThunkDispatch<RootState, void, OrderActions>;

