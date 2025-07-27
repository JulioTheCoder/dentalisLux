"use client"

import { useUser } from "@/context/user-context"
import LogoutLoading from "./logout-loading"

export default function LogoutLoadingWrapper({ children }) {
  const { showLogoutLoading } = useUser()

  return (
    <>
      {children}
      {showLogoutLoading && <LogoutLoading />}
    </>
  )
} 