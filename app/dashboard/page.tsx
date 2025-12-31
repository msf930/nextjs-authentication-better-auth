import { redirect } from "next/navigation";
import DashboardClientPage from "./dashboard-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return <DashboardClientPage />;
}
