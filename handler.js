var AWS = require("aws-sdk");

//Replace with your Moltin and TaxJar keys
const MoltinGateway = require("moltin.js").gateway;
const { createClient: MoltinClient } = require("@moltin/request");

var taxJar = require("taxjar")("XXXXX");
//Your Moltin Keys
const Moltin = new MoltinClient({
  client_id: "XXXXX",
  client_secret: "XXXXX"
});
function generateResponse(code, taxData) {
  const response =
    "Added to cart with taxes, fetch the cart to see what your working with";
  try {
    return {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(response)
    };
  } catch (err) {
    return generateError(500, err);
  }
}

function generateError(code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(err.message)
  };
}
async function addToCart(cartData) {
  console.log("cart items", cartData.item);
  const cartItems = await Moltin.post(`/carts/${cartData.item.cartId}/items`, {
    type: "custom_item",
    name: cartData.item.name,
    sku: cartData.item.sku,
    description: cartData.item.description,
    quantity: cartData.item.quantity,
    price: {
      amount: cartData.item.amount
    }
  });
  return cartItems;
}

async function getTaxAmount(zipCode) {
  let result = await taxJar.ratesForLocation(zipCode);
  return result.rate;
}

//Send tax rate to Moltin
async function taxMoltin(items, cartData) {
  //get tax rate form taxjar
  const taxObject = await getTaxAmount(cartData.zipcode);
  console.log(taxObject);
  console.log(Number(taxObject.state_rate));

  const tax = {
    type: "tax_item",
    rate: Number(taxObject.state_rate)
  };

  const taxApplied = await Moltin.post(
    `/carts/${cartData.item.cartId}/items/${items.data[0].id}/taxes`,
    tax
  );
  console.log("tax applied", taxApplied);
  //TODO now post that for each item to /cart/cart-item/taxes
  return taxApplied;
}

module.exports.tax = async event => {
  try {
    let cartData = JSON.parse(event.body);
    //Have to add it to cart first
    const cartItems = await addToCart(cartData);
    //Apply tax rate to the items in the cart
    const taxApplied = await taxMoltin(cartItems, cartData);
    console.log("tax Apploed", taxApplied);
    return generateResponse(200, taxApplied);
  } catch (err) {
    return generateError(500, err);
  }
};
