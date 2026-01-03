import { Fragment } from "react";

import Home from "@/components/content/home/Home";

import ProductsDiscount from "@/components/content/discount/ProductsDiscount"

import Products from "@/components/content/products/Products";

import Services from "@/components/content/services/Services";

import { fetchProducts, fetchProductsDiscount } from "@/utils/fetching/FetchProducts";

export default async function Page() {
  const products = await fetchProducts();
  const productsDiscount = await fetchProductsDiscount();
  return (
    <Fragment>
      <Home />
      <Services />
      <ProductsDiscount productsDiscount={productsDiscount} />
      <Products products={products} />
    </Fragment>
  )
}