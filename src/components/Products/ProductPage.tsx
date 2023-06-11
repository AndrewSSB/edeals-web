import React, { useContext } from "react";
import { Grid } from "@mui/material";
import { ProductCard } from "./ProductCard";
import { ProductContext } from "../../context/ProductsContext";

export const ProductPage = () => {
  const { products } = useContext(ProductContext);

  return (
    <div style={{ margin: "20px 20px" }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </Grid>
    </div>
  );
};
