import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Paper, Theme, styled, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { Address } from "../../context/UserContext";

const NoShadowPaper = styled(Paper)`
  box-shadow: none;
`;

interface AddressFormProps {
  firstName: string | null;
  lastName: string | null;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  address: Address | null | undefined;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
}

export const AddressForm = (props: AddressFormProps) => {
  return (
    <div>
      <Typography
        variant="h6"
        display={"flex"}
        justifyContent={"center"}
        marginBottom={"20px"}
      >
        Introdu adresa de livrare
      </Typography>
      <Grid container spacing={1} component={NoShadowPaper}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="Nume"
            label="Nume"
            value={props.firstName ?? ""}
            onChange={(event: any) => {
              props.setFirstName(event.target.value);
            }}
            fullWidth
            autoComplete="given-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="Prenume"
            value={props.lastName ?? ""}
            onChange={(event: any) => {
              props.setLastName(event.target.value);
            }}
            label="Prenume"
            fullWidth
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Adresa 1"
            value={props.address?.address ?? ""}
            onChange={(event: any) => {
              props.setAddress({
                ...props.address,
                address: event.target.value,
              });
            }}
            fullWidth
            autoComplete="shipping address-line1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Adresa 2"
            value={props.address?.addressAditionally ?? ""}
            onChange={(event: any) => {
              props.setAddress({
                ...props.address,
                addressAditionally: event.target.value,
              });
            }}
            fullWidth
            autoComplete="shipping address-line2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="Oraș"
            label="Oraș"
            value={props.address?.city ?? ""}
            onChange={(event: any) => {
              props.setAddress({
                ...props.address,
                city: event.target.value,
              });
            }}
            fullWidth
            autoComplete="shipping address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="Județ"
            value={props.address?.region ?? ""}
            onChange={(event: any) => {
              props.setAddress({
                ...props.address,
                region: event.target.value,
              });
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <TextField
                required
                id="zip"
                name="zip"
                label="Cod Poștal"
                value={props.address?.postalCode ?? ""}
                onChange={(event: any) => {
                  props.setAddress({
                    ...props.address,
                    postalCode: event.target.value,
                  });
                }}
                fullWidth
                autoComplete="shipping postal-code"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="mentiuni"
            name="mentiuni"
            label="Mențiuni către livrator"
            value={props.address?.mentiuni ?? ""}
            onChange={(event: any) => {
              props.setAddress({
                ...props.address,
                mentiuni: event.target.value,
              });
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                style={{ color: "#646FCB" }}
                name="saveAddress"
                value="yes"
              />
            }
            label="Salvează adresa pentru următoare comenzi"
          />
        </Grid>
      </Grid>
    </div>
  );
};
