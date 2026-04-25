import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserIdFromSession } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-04-22.dahlia",
});


export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { postId, planId, planName, price } = await req.json();

    if (!postId || !planId || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Boost Post: ${planName}`,
              description: `Upgrade your post visibility with the ${planName} plan.`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/my-posts?success=true&session_id={CHECKOUT_SESSION_ID}&post=${postId}&plan=${planId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/my-posts?canceled=true`,
      metadata: {
        userId: userId.toString(),
        postId: postId.toString(),
        planId: planId.toString(),
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
