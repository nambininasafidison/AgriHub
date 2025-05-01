import { redirect } from "next/navigation"
import { logout } from "@/lib/actions/auth"

export async function GET() {
  await logout()
  redirect("/")
}
