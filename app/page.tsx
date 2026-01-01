import { Fragment } from "react";

import Home from "@/components/content/home/Home";

import Products from "@/components/content/products/Products";

import { fetchProducts } from "@/utils/fetching/FetchProducts";

export default async function Page() {
  const products = await fetchProducts();

  return (
    <Fragment>
      <Home />
      <Products products={products} />
    </Fragment>
  )
}
