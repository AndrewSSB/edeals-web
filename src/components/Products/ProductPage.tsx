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
      {products.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div
            style={{ color: "#646FCB", fontSize: "20px", fontWeight: "600" }}
          >
            Ne pare rău, nu am gasit produsul introdus.
            <ul>
              <li>Verifica daca ai scris corect termenii.</li>
              <li>Încearcă din nou, folosind o cautare mai generala.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
