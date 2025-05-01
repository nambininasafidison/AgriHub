import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CartItemForm from "@/components/cart-item-form";
import PromoCodeForm from "@/components/promo-code-form";
import { formatCurrency } from "@/lib/utils/format";
import type { CartItem } from "@/lib/types";
import { cookies } from "next/headers";
import { getSession } from "@/lib/actions/auth";

async function getCart(userId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: {
        Cookie: `token=${(await cookies()).get("token")?.value || ""}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    };
  }
}

export default async function CartPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?callbackUrl=/cart");
  }

  const cart = await getCart(session.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-gray-600">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Cart Items ({cart.items.length})
                </h2>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item: CartItem) => (
                    <Suspense
                      key={item.productId}
                      fallback={
                        <div className="h-24 animate-pulse bg-gray-100"></div>
                      }
                    >
                      <CartItemForm item={item} />
                    </Suspense>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(cart.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(cart.shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {formatCurrency(cart.tax)}
                  </span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{formatCurrency(cart.discount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(cart.total)}
                    </span>
                  </div>
                </div>

                <Suspense
                  fallback={
                    <div className="h-10 animate-pulse bg-gray-100"></div>
                  }
                >
                  <PromoCodeForm currency={cart.currency || "USD"} />
                </Suspense>

                <Link
                  href="/checkout"
                  className="block w-full rounded-md bg-green-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-green-700"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
