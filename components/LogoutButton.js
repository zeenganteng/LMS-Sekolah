"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{ width: "auto", padding: "6px 16px" }}
    >
      Keluar
    </button>
  );
}
