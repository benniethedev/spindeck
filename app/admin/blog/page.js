import { createClient } from "@/libs/pressbase/server";
import { isAdminEmail } from "@/libs/admin";
import { redirect } from "next/navigation";
import BlogAdminPanel from "@/components/admin/BlogAdminPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog Management | SpinRec Admin",
  description: "Manage blog posts",
};

export default async function AdminBlogPage() {
  const pb = createClient();
  
  const { data: { user } } = await pb.auth.getUser();
  
  if (!user) {
    redirect("/signin");
  }
  
  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }
  
  return <BlogAdminPanel user={user} />;
}
