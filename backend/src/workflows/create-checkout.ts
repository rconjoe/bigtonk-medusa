import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { stripe } from "../lib/stripe";
import { Modules } from "@medusajs/framework/utils";

const frontend_url = process.env.FRONTEND_URL;

// type workflow input
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  variantId: string;
  uniqueCartItemId: string;
  stripe_product_id: string;
  stripe_price_id: string;
  quantity: number;
};

type CreateCheckoutWorkflowInput = Array<CartItem>;
// type CreateStripeCheckoutInput = {
//   cartItems: Array<CartItem>;
//   cartId: string;
// };

const createStripeCheckoutStep = createStep(
  "create-stripe-checkout",
  async (stepInput: CreateCheckoutWorkflowInput) => {
    let line_items = [];

    console.log("Creating stripe checkout with items:", stepInput);

    stepInput.forEach((item: CartItem) => {
      line_items.push({
        price: item.stripe_price_id,
        quantity: item.quantity,
      });
    });

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      allow_promotion_codes: true,
      line_items,
      mode: "payment",
      ui_mode: "embedded",
      return_url: `${frontend_url}/return?session_id={CHECKOUT_SESSION_ID}`,
      // metadata: {
      //   medusa_cart_id: stepInput.cartId,
      // },
    });

    console.log(
      `Checkout session created with client secret: ${session.client_secret}`,
    );

    return new StepResponse({ clientSecret: session.client_secret });
  },
);

const createMedusaCartStep = createStep(
  "create-medusa-cart",
  async (stepInput: CreateCheckoutWorkflowInput, { container }) => {
    const cartModule = container.resolve(Modules.CART);

    let cartItems = [];

    console.log("Creating medusa cart with items:", stepInput);

    stepInput.forEach((item: CartItem) => {
      cartItems.push({
        title: item.name,
        product_title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        variant_id: item.variantId,
        metadata: {
          stripe_product_id: item.stripe_product_id,
          stripe_price_id: item.stripe_price_id,
        },
      });
    });

    const cart = await cartModule.createCarts({
      currency_code: "usd",
      region_id: "reg_01K49C2Y6MXY9ZNG0XCRCNBN1N",
      sales_channel_id: "sc_01K3CH19X3F9BQKJTDZD27EBGZ",
      items: cartItems,
    });

    console.log(`Cart created with id: ${cart.id}`);

    return new StepResponse({ cartId: cart.id });
  },
);

export const createCheckoutWorkflow = createWorkflow(
  "create-checkout",
  (workflowInput: WorkflowData<CreateCheckoutWorkflowInput>) => {
    // const cart = createMedusaCartStep(workflowInput);
    const session = createStripeCheckoutStep(workflowInput);

    return new WorkflowResponse({
      clientSecret: session.clientSecret,
      // cartId: cart.cartId,
    });
  },
);
