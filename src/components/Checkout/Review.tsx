import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { ShoppingSession } from "../../context/ProductsContext";
import "../ProductDetails/Swiper.css";
import { Address } from "../../context/UserContext";

interface ReviewProps {
  shoppingSession: ShoppingSession;
  address: Address;
  firstName: string | null;
  lastName: string | null;
}

export const DisplayAddress = (props: ReviewProps) => {
  let niceAddress = props.address.address ?? "";

  if (
    props.address.addressAditionally !== "" &&
    props.address.addressAditionally
  ) {
    niceAddress = niceAddress + ", " + props.address.addressAditionally;
  }
  if (props.address?.country !== "" && props.address.addressAditionally) {
    niceAddress = niceAddress + ", " + props.address.country;
  }
  if (props.address?.region !== "" && props.address.addressAditionally) {
    niceAddress = niceAddress + ", " + props.address.region;
  }
  if (props.address?.city !== "" && props.address.addressAditionally) {
    niceAddress = niceAddress + ", " + props.address.city;
  }
  if (props.address?.postalCode !== "" && props.address.addressAditionally) {
    niceAddress = niceAddress + ", " + props.address.postalCode;
  }
  return <Typography gutterBottom>{niceAddress}</Typography>;
};

export const Review = (props: ReviewProps) => {
  return (
    <React.Fragment>
      <Typography
        variant="h6"
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        Comanda ta
      </Typography>
      <List disablePadding>
        {props.shoppingSession.cartItems.map((product) => (
          <ListItem key={product.cartItemId} sx={{ py: 2, px: 0 }}>
            <img src={product.image} width={"80px"} height={"80px"} />
            <ListItemText
              style={{ margin: "0 20px 0 20px" }}
              primary={product.productName}
              secondary={product.description}
            />
            <ListItemText
              style={{
                margin: "0 10px 0 20px",
              }}
              secondary={"x" + product.quantity}
            />
            <Typography
              width={"180px"}
              display={"flex"}
              marginLeft={"30px"}
              justifyContent={"flex-end"}
              variant="body2"
            >
              {product.productPrice} lei
            </Typography>
          </ListItem>
        ))}
        <div style={{ margin: "10px 0px 10px 0px" }} className="gray-line" />
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText style={{ marginLeft: "10px" }} primary="Transport" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            36.67 lei
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 0, px: 0 }}>
          <ListItemText style={{ marginLeft: "10px" }} primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            3186.66 lei
          </Typography>
        </ListItem>
      </List>
      <div style={{ margin: "10px 0px 10px 0px" }} className="gray-line" />
      <Grid container spacing={1} marginLeft={"2px"}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            Adresa de livrare
          </Typography>
          <Typography gutterBottom>
            {props.firstName} {props.lastName}
          </Typography>
          <DisplayAddress
            shoppingSession={props.shoppingSession}
            address={props.address}
            firstName={null}
            lastName={null}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
