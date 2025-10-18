import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-theme-primary flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
        <p className="text-theme-primary">Cargando perfil...</p>
      </div>
    </div>
  )
}
