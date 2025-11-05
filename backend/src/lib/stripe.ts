import Stripe from "stripe";

const stripe_key = process.env.STRIPE_API_KEY;

export const stripe = new Stripe(stripe_key);
