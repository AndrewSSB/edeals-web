import { Product } from "../context/ProductsContext";

interface SetProductsToLocalStorageProps {
  keyName: string;
  product: Product | undefined;
  addOnlyOnce?: boolean;
}

interface GetProductsToLocalStorageProps {
  keyName: string;
}

interface DeleteProductsToLocalStorageProps {
  keyName: string;
  productId: string;
}

export const SetProductsToLocalStorage = (
  props: SetProductsToLocalStorageProps
) => {
  var products = localStorage.getItem(props.keyName);

  if (products) {
    var parsedProducts: { [key: string]: number } = JSON.parse(products);

    if (props.product?.productId) {
      if (parsedProducts[props.product.productId] && !props.addOnlyOnce) {
        parsedProducts[props.product.productId] += 1;
      } else {
        parsedProducts[props.product.productId] = 1;
      }
    }

    localStorage.setItem(props.keyName, JSON.stringify(parsedProducts));
  } else {
    var parsedProducts: { [key: string]: number } = {};

    if (props.product?.productId) {
      parsedProducts[props.product.productId] = 1;
    }

    localStorage.setItem(props.keyName, JSON.stringify(parsedProducts));
  }
};

export const DeleteProductsFromLocalStorage = (
  props: DeleteProductsToLocalStorageProps
) => {
  var products = localStorage.getItem(props.keyName);

  if (products?.length == 1) {
    localStorage.removeItem(props.keyName);
    return;
  }

  if (products) {
    var parsedProducts: { [key: string]: number } = JSON.parse(products);

    if (props.productId && parsedProducts.hasOwnProperty(props.productId)) {
      delete parsedProducts[props.productId];

      localStorage.setItem(props.keyName, JSON.stringify(parsedProducts));
    }
  }
};

interface LocalStorageProducts {
  productId: string;
  quantity: number;
}

export const GetProductsFromLocalStorage = (
  props: GetProductsToLocalStorageProps
) => {
  var products = localStorage.getItem(props.keyName);

  if (products) {
    var parsedProducts: { [key: string]: number } = JSON.parse(products);

    const productsArray: LocalStorageProducts[] = Object.entries(
      parsedProducts
    ).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    return productsArray;
  }
};
