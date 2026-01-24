import { redirect } from "next/navigation";
import OpenPacksClientPage from "./open-packs-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ensureUserHasCollection } from "@/lib/collection";

type Session = typeof auth.$Infer.Session;

export default async function OpenPacksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  await ensureUserHasCollection(session.user.id);

  return <OpenPacksClientPage session={session as Session} />;
}
