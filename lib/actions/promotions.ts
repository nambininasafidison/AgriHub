import { db } from "@/lib/db/postgres/connection";
import { promotions } from "@/lib/db/postgres/schema/promotions";
import { InferModel, eq } from "drizzle-orm";

type PromotionInsert = InferModel<typeof promotions, "insert">;

export async function getPromotions() {
  const allPromotions = await db.select().from(promotions);
  return allPromotions;
}

export async function getPromotionByCode(code: string) {
  const [promotion] = await db
    .select()
    .from(promotions)
    .where(eq(promotions.code, code));
  return promotion || null;
}

export async function createPromotion(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const value = Number(formData.get("value"));
  const code = formData.get("code") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);

  if (
    !name ||
    !description ||
    !type ||
    !value ||
    !code ||
    !startDate ||
    !endDate
  ) {
    return { error: "Tous les champs obligatoires doivent être remplis" };
  }

  const newPromotion: PromotionInsert = {
    uuid: crypto.randomUUID(),
    name,
    description,
    type,
    value: value.toString(),
    code,
    startDate,
    endDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(promotions).values(newPromotion);
  return { success: true, promotion: newPromotion };
}
