// app/admin/layout.tsx
import { AuthGuard } from "@/components/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} allowedRoles={['ADMIN']}>
      {children}
    </AuthGuard>
  )
}