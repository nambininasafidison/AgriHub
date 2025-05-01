import CheckoutForm from "@/components/checkout-form";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { getSession } from "@/lib/actions/auth";
import { getUserById } from "@/lib/db/repository/user-repository";
import { CartItem, User, UserRole } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  const cart = await getCart(session.id);

  if (!cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  const userData = await getUserById(session.id);
  const user = {
    ...userData,
    id: userData?.id || 0,
    role: (userData?.role as "admin" | UserRole) || "user",
    name: userData?.name || "Guest",
    email: userData?.email || "guest@example.com",
    region: userData?.region ?? undefined,
    specialty: userData?.specialty ?? undefined,
    phone: userData?.phone !== null ? userData?.phone : undefined,
    avatar: userData?.avatar !== null ? userData?.avatar : undefined,
    isVerified: userData?.isVerified ?? undefined,
    createdAt: userData?.createdAt
      ? userData.createdAt.toISOString()
      : undefined,
    addresses: userData?.addresses?.map((address) => ({
      ...address,
      id: address.id.toString(),
      postalCode: address.postalCode ?? undefined,
      isDefault: !!address.isDefault,
      type: ["shipping", "billing", "both"].includes(address.type)
        ? (address.type as "shipping" | "billing" | "both")
        : "shipping",
    })),
    preferences: userData?.preferences
      ? {
          ...userData.preferences,
          notifications: {
            email: false,
            sms: false,
            push: false,
          },
          language: userData.preferences.language || "en",
          currency: userData.preferences.currency || "USD",
        }
      : undefined,
  };

  if (!user) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="mb-8">
        <CheckoutSteps currentStep={1} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-lg bg-gray-100"></div>
            }
          >
            <CheckoutForm
              user={{
                ...user,
                id: user.id.toString(),
                role: user.role as "admin" | UserRole,
              }}
              cart={cart}
              total={cart.total}
              currency={user.preferences?.currency || "USD"}
            />
          </Suspense>
        </div>

        <div>
          <div
            className="rounded-lg border bord,
                specialty: user.specialty ?? undefined,
      er-gray-200 bg-white p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

            <div className="mb-4 max-h-64 overflow-y-auto">
              {cart.items.map((item: CartItem) => (
                <div key={item.productId} className="mb-4 flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity} × {item.price.toLocaleString()} MGA
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{cart.subtotal.toLocaleString()} MGA</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{cart.shipping.toLocaleString()} MGA</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>{cart.tax.toLocaleString()} MGA</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{cart.discount.toLocaleString()} MGA</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{cart.total.toLocaleString()} MGA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
