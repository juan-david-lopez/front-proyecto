import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"

export default function RegisterPage() {
  return (
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

            <form className="space-y-6" role="form" aria-labelledby="register-form">
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
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  autoComplete="given-name"
                  aria-describedby="name-help"
                />
                <div id="name-help" className="sr-only">
                  Ingresa tu nombre completo
                </div>
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
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  autoComplete="family-name"
                  aria-describedby="lastname-help"
                />
                <div id="lastname-help" className="sr-only">
                  Ingresa tu apellido
                </div>
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
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  autoComplete="email"
                  aria-describedby="email-help"
                />
                <div id="email-help" className="sr-only">
                  Ingresa una dirección de correo electrónico válida
                </div>
              </div>

              {/* Document Type Field */}
              <div className="space-y-2">
                <Label htmlFor="doctype" className="text-white text-sm">
                  Tipo de Documento
                </Label>
                <Select required>
                  <SelectTrigger
                    className="bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500"
                    aria-describedby="doctype-help"
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
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  aria-describedby="docnumber-help"
                />
                <div id="docnumber-help" className="sr-only">
                  Ingresa el número de tu documento de identificación
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  autoComplete="new-password"
                  aria-describedby="password-help"
                />
                <div id="password-help" className="sr-only">
                  Crea una contraseña segura para tu cuenta
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmpassword" className="text-white text-sm">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmpassword"
                  type="password"
                  placeholder="********"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  required
                  autoComplete="new-password"
                  aria-describedby="confirmpassword-help"
                />
                <div id="confirmpassword-help" className="sr-only">
                  Confirma tu contraseña ingresándola nuevamente
                </div>
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
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                  autoComplete="tel"
                  aria-describedby="phone-help"
                />
                <div id="phone-help" className="sr-only">
                  Ingresa tu número de teléfono de contacto
                </div>
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
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500"
                    autoComplete="bday"
                    aria-describedby="birthdate-help"
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div id="birthdate-help" className="sr-only">
                  Selecciona tu fecha de nacimiento
                </div>
              </div>

              {/* Medical Conditions Field */}
              <div className="space-y-2">
                <Label htmlFor="medical" className="text-white text-sm">
                  Condiciones Médicas
                </Label>
                <Textarea
                  id="medical"
                  placeholder="Escribe tus condiciones médicas"
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
                <Select>
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
                <Select>
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
                  className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  required
                  aria-describedby="terms-help"
                />
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
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 mt-8 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-describedby="register-button-help"
              >
                Registrarse
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
  )
}
