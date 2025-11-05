import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { stripe } from "../../../lib/stripe";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  console.log(req.query);
  // @ts-ignore
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
}
