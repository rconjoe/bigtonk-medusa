import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { stripe } from "../../../lib/stripe";

// const backend_url = process.env.BACKEND_URL;
const frontend_url = process.env.FRONTEND_URL;

// type CreateCheckoutRequestBody = Array<{
//   price_data: {
//     currency: string;
//     product_data: {
//       name: string;
//     };
//     unit_amount: number;
//   };
//   quantity: number;
// }>;

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  variantId: string;
  uniqueCartItemId: string;
  quantity: number;
  stripe_price_id: string;
  stripe_product_id: string;
};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // MedusaRequest should already have the body parsed if the
    // Content-Type is 'application/json' and body-parser is set up.
    const cartItems = req.body;
    let line_items = [];

    console.log("Received cart items:", cartItems);

    // @ts-ignore
    cartItems.forEach((item: CartItem) => {
      line_items.push({
        price: item.stripe_price_id,
        quantity: item.quantity,
      });
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      ui_mode: "embedded",
      return_url: `${frontend_url}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    res.status(200).json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error("Error in /checkout/create endpoint:", e);
    // You should send a more descriptive error if possible
    res.status(500).send({ message: "Internal Server Error" });
  }
}
