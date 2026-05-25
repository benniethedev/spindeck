import { createClient } from "@/libs/pressbase/server";
import { isAdminEmail } from "@/libs/admin";
import { redirect } from "next/navigation";
import EmailAdminPanel from "@/components/admin/EmailAdminPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Email Management | SpinRec Admin",
  description: "Manage email subscribers and send blasts",
};

export default async function AdminEmailPage() {
  const pb = createClient();
  
  const { data: { user } } = await pb.auth.getUser();
  
  if (!user) {
    redirect("/signin");
  }
  
  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }
  
  return <EmailAdminPanel user={user} />;
}
