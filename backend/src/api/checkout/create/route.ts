import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createCheckoutWorkflow } from "../../../workflows/create-checkout";

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
    const cartItems = req.body;

    console.log("Received cart items:", cartItems);

    const response = await createCheckoutWorkflow(req.scope).run({
      // @ts-ignore
      input: cartItems,
    });

    res.status(200).json(response);
  } catch (e) {
    console.error("Error in /checkout/create endpoint:", e);
    // You should send a more descriptive error if possible
    res.status(500).send({ message: "Internal Server Error" });
  }
}
