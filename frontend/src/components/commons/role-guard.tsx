"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/store/hooks";
import type { UserRoleEnum } from "@/src/types/user";

interface RoleGuardProps {
  allowedRoles: UserRoleEnum[];
  children: React.ReactNode;
}

/**
 * Wraps a page/layout and redirects to /401 if the current user's
 * role is not in the allowedRoles list.
 *
 * Renders null while auth is still loading to prevent flash.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const router = useRouter();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isLoading) return;
    // Not logged in OR role is not allowed → go to 401
    if (!user || !allowedRoles.includes(user.role)) {
      router.replace("/401");
    }
  }, [user, isLoading, allowedRoles, router]);

  // While loading, or if user is not authorised, render nothing
  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
