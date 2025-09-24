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

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    doctype: "",
    docnumber: "",
    password: "",
    confirmpassword: "",
    phone: "",
    birthdate: "",
    medical: "",
    branch: "",
    role: "miembro",
    terms: false,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)
  }

  const validateDocumentNumber = (docnumber: string) => {
    return /^\d{6,12}$/.test(docnumber)
  }

  const validateAge = (birthdate: string) => {
    const today = new Date()
    const birth = new Date(birthdate)
    const age = today.getFullYear() - birth.getFullYear()
    return age >= 16 && age <= 100
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "El apellido es requerido"
    } else if (formData.lastname.trim().length < 2) {
      newErrors.lastname = "El apellido debe tener al menos 2 caracteres"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (!formData.doctype) {
      newErrors.doctype = "Selecciona un tipo de documento"
    }

    if (!formData.docnumber.trim()) {
      newErrors.docnumber = "El número de documento es requerido"
    } else if (!validateDocumentNumber(formData.docnumber)) {
      newErrors.docnumber = "El número de documento debe tener entre 6 y 12 dígitos"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
    }

    if (!formData.confirmpassword) {
      newErrors.confirmpassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Las contraseñas no coinciden"
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Ingresa un número de teléfono válido"
    }

    if (formData.birthdate && !validateAge(formData.birthdate)) {
      newErrors.birthdate = "Debes tener entre 16 y 100 años"
    }

    if (!formData.terms) {
      newErrors.terms = "Debes aceptar los términos y condiciones"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("[v0] Registration data:", formData)

      // Redirect to OTP verification
      router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`)
    } catch (error) {
      setErrors({ general: "Error al registrar. Intenta nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <FitZoneLogo />
        </header>

        <main className="w-full max-w-md mt-20">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <Link href="/" className="inline-block mb-8" aria-label="Volver a la página principal">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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

              <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="register-form">
                <div id="register-form" className="sr-only">
                  Formulario de registro de nueva cuenta
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white text-sm">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="given-name"
                    aria-describedby="name-help name-error"
                  />
                  <div id="name-help" className="sr-only">
                    Ingresa tu nombre completo
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-sm" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-white text-sm">
                    Apellido
                  </Label>
                  <Input
                    id="lastname"
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.lastname}
                    onChange={(e) => handleInputChange("lastname", e.target.value)}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                      errors.lastname ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="family-name"
                    aria-describedby="lastname-help lastname-error"
                  />
                  <div id="lastname-help" className="sr-only">
                    Ingresa tu apellido
                  </div>
                  {errors.lastname && (
                    <p id="lastname-error" className="text-red-400 text-sm" role="alert">
                      {errors.lastname}
                    </p>
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="email"
                    aria-describedby="email-help email-error"
                  />
                  <div id="email-help" className="sr-only">
                    Ingresa una dirección de correo electrónico válida
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-red-400 text-sm" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Document Type Field */}
                <div className="space-y-2">
                  <Label htmlFor="doctype" className="text-white text-sm">
                    Tipo de Documento
                  </Label>
                  <Select
                    value={formData.doctype}
                    onValueChange={(value) => handleInputChange("doctype", value)}
                    required
                  >
                    <SelectTrigger
                      className={`bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500 ${
                        errors.doctype ? "border-red-500" : ""
                      }`}
                      aria-describedby="doctype-help doctype-error"
                    >
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="cedula" className="text-white hover:bg-gray-600">
                        Cédula de Ciudadanía
                      </SelectItem>
                      <SelectItem value="tarjeta" className="text-white hover:bg-gray-600">
                        Tarjeta de Identidad
                      </SelectItem>
                      <SelectItem value="pasaporte" className="text-white hover:bg-gray-600">
                        Pasaporte
                      </SelectItem>
                      <SelectItem value="extranjeria" className="text-white hover:bg-gray-600">
                        Cédula de Extranjería
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div id="doctype-help" className="sr-only">
                    Selecciona el tipo de documento de identificación
                  </div>
                  {errors.doctype && (
                    <p id="doctype-error" className="text-red-400 text-sm" role="alert">
                      {errors.doctype}
                    </p>
                  )}
                </div>

                {/* Document Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="docnumber" className="text-white text-sm">
                    Número de Documento
                  </Label>
                  <Input
                    id="docnumber"
                    type="text"
                    placeholder="Número de documento"
                    value={formData.docnumber}
                    onChange={(e) => handleInputChange("docnumber", e.target.value.replace(/\D/g, ""))}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                      errors.docnumber ? "border-red-500" : ""
                    }`}
                    required
                    aria-describedby="docnumber-help docnumber-error"
                  />
                  <div id="docnumber-help" className="sr-only">
                    Ingresa el número de tu documento de identificación
                  </div>
                  {errors.docnumber && (
                    <p id="docnumber-error" className="text-red-400 text-sm" role="alert">
                      {errors.docnumber}
                    </p>
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
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="new-password"
                      aria-describedby="password-help password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div id="password-help" className="sr-only">
                    Crea una contraseña segura para tu cuenta
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-red-400 text-sm" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmpassword" className="text-white text-sm">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmpassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.confirmpassword}
                      onChange={(e) => handleInputChange("confirmpassword", e.target.value)}
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-10 ${
                        errors.confirmpassword ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="new-password"
                      aria-describedby="confirmpassword-help confirmpassword-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div id="confirmpassword-help" className="sr-only">
                    Confirma tu contraseña ingresándola nuevamente
                  </div>
                  {errors.confirmpassword && (
                    <p id="confirmpassword-error" className="text-red-400 text-sm" role="alert">
                      {errors.confirmpassword}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white text-sm">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    autoComplete="tel"
                    aria-describedby="phone-help phone-error"
                  />
                  <div id="phone-help" className="sr-only">
                    Ingresa tu número de teléfono de contacto
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className="text-red-400 text-sm" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Birth Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="birthdate" className="text-white text-sm">
                    Fecha de Nacimiento
                  </Label>
                  <div className="relative">
                    <Input
                      id="birthdate"
                      type="date"
                      placeholder="dd/mm/aaaa"
                      value={formData.birthdate}
                      onChange={(e) => handleInputChange("birthdate", e.target.value)}
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                        errors.birthdate ? "border-red-500" : ""
                      }`}
                      autoComplete="bday"
                      aria-describedby="birthdate-help birthdate-error"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div id="birthdate-help" className="sr-only">
                    Selecciona tu fecha de nacimiento
                  </div>
                  {errors.birthdate && (
                    <p id="birthdate-error" className="text-red-400 text-sm" role="alert">
                      {errors.birthdate}
                    </p>
                  )}
                </div>

                {/* Medical Conditions Field */}
                <div className="space-y-2">
                  <Label htmlFor="medical" className="text-white text-sm">
                    Condiciones Médicas
                  </Label>
                  <Textarea
                    id="medical"
                    placeholder="Escribe tus condiciones médicas"
                    value={formData.medical}
                    onChange={(e) => handleInputChange("medical", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 min-h-[80px]"
                    aria-describedby="medical-help"
                  />
                  <div id="medical-help" className="sr-only">
                    Describe cualquier condición médica relevante para tu entrenamiento
                  </div>
                </div>

                {/* Main Branch Field */}
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-white text-sm">
                    Sede Principal
                  </Label>
                  <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)}>
                    <SelectTrigger
                      className="bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500"
                      aria-describedby="branch-help"
                    >
                      <SelectValue placeholder="Sede Principal" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="norte" className="text-white hover:bg-gray-600">
                        Sede Norte
                      </SelectItem>
                      <SelectItem value="sur" className="text-white hover:bg-gray-600">
                        Sede Sur
                      </SelectItem>
                      <SelectItem value="centro" className="text-white hover:bg-gray-600">
                        Sede Centro
                      </SelectItem>
                      <SelectItem value="oriente" className="text-white hover:bg-gray-600">
                        Sede Oriente
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div id="branch-help" className="sr-only">
                    Selecciona la sede principal donde entrenarás
                  </div>
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white text-sm">
                    Rol
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger
                      className="bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500"
                      aria-describedby="role-help"
                    >
                      <SelectValue placeholder="Miembro" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="miembro" className="text-white hover:bg-gray-600">
                        Miembro
                      </SelectItem>
                      <SelectItem value="entrenador" className="text-white hover:bg-gray-600">
                        Entrenador
                      </SelectItem>
                      <SelectItem value="admin" className="text-white hover:bg-gray-600">
                        Administrador
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div id="role-help" className="sr-only">
                    Selecciona tu rol en el gimnasio
                  </div>
                </div>

                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked) => handleInputChange("terms", checked as boolean)}
                    className={`border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                    required
                    aria-describedby="terms-help terms-error"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm text-white leading-relaxed">
                      Acepto los{" "}
                      <Link
                        href="/terms"
                        className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
                        aria-label="Leer términos y condiciones"
                      >
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                        href="/privacy"
                        className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
                        aria-label="Leer política de privacidad"
                      >
                        política de privacidad
                      </Link>
                    </Label>
                    <div id="terms-help" className="sr-only">
                      Debes aceptar los términos y condiciones para continuar
                    </div>
                    {errors.terms && (
                      <p id="terms-error" className="text-red-400 text-sm" role="alert">
                        {errors.terms}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 mt-8 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-describedby="register-button-help"
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
                <div id="register-button-help" className="sr-only">
                  Hacer clic para crear tu nueva cuenta
                </div>
              </form>

              <nav className="text-center mt-6" aria-label="Enlaces de inicio de sesión">
                <span className="text-gray-300">¿Ya tienes una cuenta? </span>
                <Link
                  href="/login"
                  className="text-red-500 hover:text-red-400 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded px-1"
                  aria-label="Ir a la página de inicio de sesión"
                >
                  Inicia sesión aquí
                </Link>
              </nav>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
