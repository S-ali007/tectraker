"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  if (!token) {
    router.push("/login");
  } else {
    router.push("/projects?tab=active&sortBy=name&sortOrder=asc");
  }

  return null;
}
