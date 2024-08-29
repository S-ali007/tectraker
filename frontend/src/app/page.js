"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const token = Cookies.get("accessToken");
  const router = useRouter();

  if (!token) {
    router.push("/login");
  } else {
    router.push("/projects?tab=active&sortBy=name&sortOrder=asc");
  }

  return null;
}
