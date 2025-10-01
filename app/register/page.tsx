"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { userService } from "@/services/userService"
import authService from "@/services/authService"
import { DocumentType, UserRole } from "@/types/user"

// Definir el tipo para el formulario
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  documentType: DocumentType | "";
  documentNumber: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  emergencyContactPhone: string; // Campo obligatorio según backend
  birthDate: string;
  medicalConditions: string;
  mainLocationId: string;
  role: UserRole;
  terms: boolean;
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    documentType: "",
    documentNumber: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    emergencyContactPhone: "", // Campo obligatorio
    birthDate: "",
    medicalConditions: "",
    mainLocationId: "",
    role: UserRole.MEMBER,
    terms: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Mapeo de tipos de documento del frontend al backend
  const documentTypeMap: { [key: string]: DocumentType } = {
    "cedula": DocumentType.CC,
    "tarjeta": DocumentType.CC,
    "pasaporte": DocumentType.PASSPORT,
    "extranjeria": DocumentType.CE
  }

  // Mapeo de roles del frontend al backend
  const roleMap: { [key: string]: UserRole } = {
    "miembro": UserRole.MEMBER,
    "entrenador": UserRole.INSTRUCTOR,
    "admin": UserRole.ADMIN
  }

  // Mapeo de sedes a IDs (debes obtener estos IDs de tu backend)
  const locationMap: { [key: string]: number } = {
    "norte": 1,
    "sur": 2,
    "centro": 3,
    "oriente": 4
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password) &&
           /[@$!%*?&]/.test(password)
  }

  const validateDocumentNumber = (docnumber: string) => {
    return /^[0-9]{6,20}$/.test(docnumber)
  }

  const validateAge = (birthdate: string) => {
    const today = new Date()
    const birth = new Date(birthdate)
    const age = today.getFullYear() - birth.getFullYear()
    return age >= 16 && age <= 100
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido"
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido"
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (!formData.documentType) {
      newErrors.documentType = "Selecciona un tipo de documento"
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = "El número de documento es requerido"
    } else if (!validateDocumentNumber(formData.documentNumber)) {
      newErrors.documentNumber = "El número de documento debe tener entre 6 y 20 dígitos"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "El número de teléfono es requerido"
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Ingresa un número de teléfono válido"
    }

    if (!formData.emergencyContactPhone) {
      newErrors.emergencyContactPhone = "El teléfono de emergencia es requerido"
    } else if (!validatePhone(formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = "Ingresa un teléfono de emergencia válido"
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "La fecha de nacimiento es requerida"
    } else if (!validateAge(formData.birthDate)) {
      newErrors.birthDate = "Debes tener entre 16 y 100 años"
    }

    if (!formData.terms) {
      newErrors.terms = "Debes aceptar los términos y condiciones"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Función tipada correctamente para manejar cambios en los inputs
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }))
    }
    if (errors.success) {
      setErrors((prev) => ({ ...prev, success: "" }))
    }
  }

  // Función específica para manejar cambios en inputs de texto
  const handleTextChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(field, e.target.value)
  }

  // Función específica para manejar cambios en selects
  const handleSelectChange = (field: keyof FormData) => (value: string) => {
    handleInputChange(field, value)
  }

  // Función específica para manejar cambios en checkbox
  const handleCheckboxChange = (field: keyof FormData) => (checked: boolean) => {
    handleInputChange(field, checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para el backend
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        documentType: documentTypeMap[formData.documentType] || DocumentType.CC,
        documentNumber: formData.documentNumber.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim(),
        emergencyContactPhone: formData.emergencyContactPhone.trim(), // Campo obligatorio
        birthDate: formData.birthDate,
        medicalConditions: formData.medicalConditions.trim() || "",
        mainLocationId: formData.mainLocationId ? locationMap[formData.mainLocationId] : undefined,
        role: roleMap[formData.role] || UserRole.MEMBER
      }

      console.log("Enviando datos de registro:", userData)

      // Llamar al servicio de registro público
      const response = await userService.publicRegister(userData)

      console.log("Usuario registrado exitosamente:", response)

      // Después del registro exitoso, solicitar OTP para verificación
      try {
        console.log("Solicitando envío de OTP para verificación...")
        await authService.resendOtp(formData.email.trim())
        
        setErrors({ 
          success: "¡Registro exitoso! Se ha enviado un código de verificación a tu correo." 
        })

        // Redirigir a verificación OTP después de 2 segundos
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}&type=register`)
        }, 2000)
        
      } catch (otpError: any) {
        console.error("Error al enviar OTP:", otpError)
        // Si falla el envío del OTP, redirigir manualmente
        setErrors({ 
          success: "¡Registro exitoso! Haz clic en 'Continuar' para verificar tu cuenta."
        })
        
        // Agregar botón para continuar manualmente
        setTimeout(() => {
          if (window.confirm("¿Deseas continuar a la verificación OTP?")) {
            router.push(`/verify-otp?email=${encodeURIComponent(formData.email.trim())}&type=register`)
          }
        }, 3000)
      }

    } catch (error: any) {
      console.error("Error en el registro:", error)
      
      let errorMessage = "Error al registrar. Intenta nuevamente."
      
      if (error.message) {
        if (error.message.includes("409") || error.message.includes("duplicate")) {
          errorMessage = "El correo electrónico o documento ya está registrado."
        } else if (error.message.includes("400")) {
          errorMessage = "Datos inválidos. Verifica la información ingresada."
        } else {
          errorMessage = error.message
        }
      }

      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <FitZoneLogo 
            size="lg" 
            variant="light" 
            href="/"
          />
        </header>

        <main className="w-full max-w-md mt-20">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <Link href="/" className="inline-block mb-8" aria-label="Volver a la página principal">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                  VOLVER
                </Button>
              </Link>

              <h1 className="text-3xl font-bold text-red-500 text-center mb-8">Registro</h1>

              {errors.general && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6" role="alert">
                  {errors.general}
                </div>
              )}

              {errors.success && (
                <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6" role="alert">
                  {errors.success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white text-sm">
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={handleTextChange("firstName")}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white text-sm">
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={handleTextChange("lastName")}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm">{errors.lastName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleTextChange("email")}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Document Type Field */}
                <div className="space-y-2">
                  <Label htmlFor="documentType" className="text-white text-sm">
                    Tipo de Documento
                  </Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={handleSelectChange("documentType")}
                    required
                  >
                    <SelectTrigger
                      className={`bg-gray-700 border-gray-600 text-white focus:border-red-500 ${
                        errors.documentType ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                      <SelectItem value="extranjeria">Cédula de Extranjería</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.documentType && (
                    <p className="text-red-400 text-sm">{errors.documentType}</p>
                  )}
                </div>

                {/* Document Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="documentNumber" className="text-white text-sm">
                    Número de Documento
                  </Label>
                  <Input
                    id="documentNumber"
                    type="text"
                    placeholder="Número de documento"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange("documentNumber", e.target.value.replace(/\D/g, ""))}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.documentNumber ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.documentNumber && (
                    <p className="text-red-400 text-sm">{errors.documentNumber}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.password}
                      onChange={handleTextChange("password")}
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white text-sm">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleTextChange("confirmPassword")}
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 pr-10 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white text-sm">
                    Teléfono
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.phoneNumber}
                    onChange={handleTextChange("phoneNumber")}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="tel"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>

                {/* Emergency Contact Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone" className="text-white text-sm">
                    Teléfono de Emergencia
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    placeholder="Teléfono de contacto de emergencia"
                    value={formData.emergencyContactPhone}
                    onChange={handleTextChange("emergencyContactPhone")}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.emergencyContactPhone ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="tel"
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-red-400 text-sm">{errors.emergencyContactPhone}</p>
                  )}
                </div>

                {/* Birth Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-white text-sm">
                    Fecha de Nacimiento
                  </Label>
                  <div className="relative">
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleTextChange("birthDate")}
                      className={`bg-gray-700 border-gray-600 text-white focus:border-red-500 ${
                        errors.birthDate ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="bday"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.birthDate && (
                    <p className="text-red-400 text-sm">{errors.birthDate}</p>
                  )}
                </div>

                {/* Medical Conditions Field */}
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions" className="text-white text-sm">
                    Condiciones Médicas (Opcional)
                  </Label>
                  <Textarea
                    id="medicalConditions"
                    placeholder="Escribe tus condiciones médicas relevantes"
                    value={formData.medicalConditions}
                    onChange={handleTextChange("medicalConditions")}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 min-h-[80px]"
                  />
                </div>

                {/* Main Branch Field */}
                <div className="space-y-2">
                  <Label htmlFor="mainLocationId" className="text-white text-sm">
                    Sede Principal (Opcional)
                  </Label>
                  <Select value={formData.mainLocationId} onValueChange={handleSelectChange("mainLocationId")}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500">
                      <SelectValue placeholder="Selecciona una sede" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="norte">Sede Norte</SelectItem>
                      <SelectItem value="sur">Sede Sur</SelectItem>
                      <SelectItem value="centro">Sede Centro</SelectItem>
                      <SelectItem value="oriente">Sede Oriente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white text-sm">
                    Tipo de Usuario
                  </Label>
                  <Select value={formData.role} onValueChange={handleSelectChange("role")}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="miembro">Miembro</SelectItem>
                      <SelectItem value="entrenador">Entrenador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={handleCheckboxChange("terms")}
                    className={`border-gray-600 data-[state=checked]:bg-red-600 ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                    required
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm text-white leading-relaxed">
                      Acepto los{" "}
                      <Link href="/terms" className="text-red-500 hover:text-red-400">
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/privacy" className="text-red-500 hover:text-red-400">
                        política de privacidad
                      </Link>
                    </Label>
                    {errors.terms && (
                      <p className="text-red-400 text-sm">{errors.terms}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-3 mt-8"
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <span className="text-gray-300">¿Ya tienes una cuenta? </span>
                <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}