import { redirect } from "next/navigation";
import CollectionClientPage from "./collection-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ensureUserHasCollection } from "@/lib/collection";

type Session = typeof auth.$Infer.Session;

export default async function CollectionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  await ensureUserHasCollection(session.user.id);

  return <CollectionClientPage session={session as Session} />;
}
