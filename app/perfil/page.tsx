"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/auth-guard"
import { BackButton } from "@/components/back-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, Calendar, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { userService } from "@/services/userService"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function PerfilPage() {
  const { success, error: showError } = useToast()
  const router = useRouter()
  const { logout } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleting, setDeleting] = useState(false)
  
  // Datos del perfil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const userData = userService.getCurrentUser()
      
      if (userData) {
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          birthDate: userData.birthDate || "",
        })
      }
    } catch (err) {
      showError("Error", "No se pudo cargar la información del usuario")
      console.error("Error loading user data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      
      // Validaciones básicas
      if (!profileData.name.trim()) {
        showError("Error", "El nombre es obligatorio")
        return
      }
      
      if (!profileData.email.trim()) {
        showError("Error", "El correo electrónico es obligatorio")
        return
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileData.email)) {
        showError("Error", "El formato del correo electrónico no es válido")
        return
      }
      
      // Validar teléfono si está presente
      if (profileData.phone && !/^\d{10}$/.test(profileData.phone.replace(/\s/g, ""))) {
        showError("Error", "El teléfono debe tener 10 dígitos")
        return
      }
      
      // Aquí iría la llamada al servicio para actualizar el perfil
      // await userService.updateProfile(profileData)
      
      // Simular actualización
      const currentUser = userService.getCurrentUser()
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...profileData,
        }
        localStorage.setItem("fitzone-user", JSON.stringify(updatedUser))
      }
      
      success(
        "Perfil actualizado",
        "Tu información personal ha sido actualizada exitosamente"
      )
    } catch (err) {
      showError("Error", "No se pudo actualizar el perfil. Intenta nuevamente.")
      console.error("Error saving profile:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "ELIMINAR") {
      showError("Error", 'Debes escribir "ELIMINAR" para confirmar')
      return
    }

    try {
      setDeleting(true)
      
      // Aquí iría la llamada al servicio para eliminar la cuenta
      // await userService.deleteAccount()
      
      // Simular eliminación
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      success(
        "Cuenta eliminada",
        "Tu cuenta ha sido eliminada exitosamente. Esperamos verte de nuevo pronto."
      )
      
      // Cerrar sesión y redirigir
      setTimeout(() => {
        logout()
        router.push("/")
      }, 2000)
      
    } catch (err) {
      showError("Error", "No se pudo eliminar la cuenta. Intenta nuevamente.")
      console.error("Error deleting account:", err)
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-theme-primary flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <span className="ml-2 text-theme-primary">Cargando perfil...</span>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-theme-primary text-theme-primary">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-theme-primary border-b border-theme">
          <div className="flex items-center space-x-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
          </div>
        </header>

        <div className="px-6 py-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Información Personal */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-theme-primary flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-500" />
                  Información Personal
                </CardTitle>
                <CardDescription className="text-theme-secondary">
                  Actualiza tus datos personales y de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-theme-secondary" />
                    Nombre Completo *
                  </Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Juan Pérez"
                    className="bg-theme-primary border-theme"
                    required
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-theme-secondary" />
                    Correo Electrónico *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="juan@ejemplo.com"
                    className="bg-theme-primary border-theme"
                    required
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-theme-secondary" />
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="3001234567"
                    className="bg-theme-primary border-theme"
                    maxLength={10}
                  />
                  <p className="text-xs text-theme-secondary">
                    Formato: 10 dígitos sin espacios ni guiones
                  </p>
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-theme-secondary" />
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle 123 #45-67"
                    className="bg-theme-primary border-theme"
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-theme-secondary" />
                    Fecha de Nacimiento
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="bg-theme-primary border-theme"
                  />
                </div>

                {/* Botón Guardar */}
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>

                <p className="text-xs text-theme-secondary text-center">
                  * Campos obligatorios
                </p>
              </CardContent>
            </Card>

            {/* Zona de Peligro - Eliminar Cuenta */}
            <Card className="card-theme border-red-600 border-2">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-red-500 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Zona de Peligro
                </CardTitle>
                <CardDescription className="text-theme-secondary">
                  Las acciones en esta sección son irreversibles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <h3 className="font-semibold text-red-500 mb-2">Eliminar Cuenta</h3>
                  <p className="text-sm text-theme-secondary mb-4">
                    Esta acción eliminará permanentemente tu cuenta, todos tus datos, 
                    membresías activas, reservas y no podrá ser revertida.
                  </p>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Mi Cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog de Confirmación para Eliminar Cuenta */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-theme-primary border-theme">
            <DialogHeader>
              <DialogTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                ¿Estás seguro de eliminar tu cuenta?
              </DialogTitle>
              <DialogDescription className="text-theme-secondary">
                Esta acción es permanente e irreversible. Se eliminarán:
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <ul className="space-y-2 text-sm text-theme-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Toda tu información personal y de perfil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Tu membresía activa (si tienes una)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Todas tus reservas y clases programadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Tu historial de pagos y transacciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Todos tus logros y progreso</span>
                </li>
              </ul>

              <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                <p className="text-sm text-theme-primary font-semibold mb-2">
                  Para confirmar, escribe "ELIMINAR" en el campo de abajo:
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Escribe ELIMINAR"
                  className="bg-theme-primary border-theme uppercase"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteConfirmation("")
                }}
                disabled={deleting}
                className="border-theme"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== "ELIMINAR"}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Permanentemente
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
