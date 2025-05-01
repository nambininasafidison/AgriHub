import { db } from "@/lib/db/postgres/connection";
import { shippingMethods } from "@/lib/db/postgres/schema/shipping";

export async function getShippingOptions() {
  const shippingOptions = await db.select().from(shippingMethods);
  return shippingOptions;
}

export async function createShippingOption(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const estimatedDeliveryTime = formData.get("estimatedDelivery") as string;

  if (!name || !price || !estimatedDeliveryTime) {
    return { error: "Tous les champs obligatoires doivent être remplis" };
  }

  const newShippingOption = {
    name,
    price,
    estimatedDeliveryTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(shippingMethods).values(newShippingOption);
  return { success: true, shippingOption: newShippingOption };
}
