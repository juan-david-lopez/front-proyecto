// app/instructor/layout.tsx
import { AuthGuard } from "@/components/auth-guard"

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} allowedRoles={['ADMIN', 'INSTRUCTOR']}>
      {children}
    </AuthGuard>
  )
}