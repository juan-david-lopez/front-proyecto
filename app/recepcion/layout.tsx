// app/recepcion/layout.tsx
import { AuthGuard } from "@/components/auth-guard"

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} allowedRoles={['ADMIN', 'RECEPTIONIST']}>
      {children}
    </AuthGuard>
  )
}