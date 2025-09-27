"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function TerminosPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-center mb-2">Términos y Condiciones</h1>
          <p className="text-center text-muted-foreground">FitZone Gimnasio</p>
          <p className="text-center text-sm text-muted-foreground">Última actualización: Enero 2025</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al registrarse y utilizar los servicios de FitZone, usted acepta estar sujeto a estos términos y
              condiciones. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Membresías y Pagos</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>2.1 Tipos de Membresía:</strong> Ofrecemos diferentes planes de membresía con beneficios
                específicos detallados en nuestro sitio web.
              </p>
              <p>
                <strong>2.2 Pagos:</strong> Los pagos deben realizarse por adelantado según el plan seleccionado. No se
                otorgan reembolsos por servicios no utilizados.
              </p>
              <p>
                <strong>2.3 Renovación:</strong> Las membresías se renuevan automáticamente a menos que se cancelen con
                30 días de anticipación.
              </p>
              <p>
                <strong>2.4 Congelamiento:</strong> Las membresías pueden congelarse por razones médicas con certificado
                médico, hasta por 3 meses al año.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Uso de las Instalaciones</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>3.1 Horarios:</strong> Las instalaciones están disponibles según los horarios publicados,
                sujetos a cambios con previo aviso.
              </p>
              <p>
                <strong>3.2 Código de Vestimenta:</strong> Se requiere ropa deportiva apropiada y calzado deportivo en
                todo momento.
              </p>
              <p>
                <strong>3.3 Comportamiento:</strong> Se debe mantener un comportamiento respetuoso hacia otros miembros
                y el personal.
              </p>
              <p>
                <strong>3.4 Equipos:</strong> Los miembros deben usar el equipo de manera apropiada y reportar cualquier
                daño inmediatamente.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Salud y Seguridad</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>4.1 Evaluación Médica:</strong> Se recomienda consultar con un médico antes de comenzar
                cualquier programa de ejercicios.
              </p>
              <p>
                <strong>4.2 Riesgo Asumido:</strong> El ejercicio físico conlleva riesgos inherentes que el miembro
                asume voluntariamente.
              </p>
              <p>
                <strong>4.3 Lesiones:</strong> FitZone no se hace responsable por lesiones que puedan ocurrir durante el
                uso de las instalaciones.
              </p>
              <p>
                <strong>4.4 Emergencias:</strong> En caso de emergencia médica, se contactará a los servicios de
                emergencia y a los contactos proporcionados por el miembro.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Suspensión y Terminación</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>5.1 Suspensión:</strong> FitZone se reserva el derecho de suspender o terminar membresías por
                violación de estos términos.
              </p>
              <p>
                <strong>5.2 Cancelación por el Miembro:</strong> Los miembros pueden cancelar con 30 días de aviso
                previo por escrito.
              </p>
              <p>
                <strong>5.3 Reembolsos:</strong> No se otorgan reembolsos por cancelaciones, excepto en casos
                específicos determinados por la administración.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Privacidad y Datos Personales</h2>
            <p className="text-muted-foreground leading-relaxed">
              El manejo de datos personales se rige por nuestra Política de Privacidad, la cual cumple con la normativa
              colombiana de protección de datos personales (Ley 1581 de 2012).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed">
              FitZone no será responsable por daños indirectos, incidentales, especiales o consecuenciales que resulten
              del uso de nuestras instalaciones o servicios, más allá de lo establecido por la ley colombiana.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Modificaciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              FitZone se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán
              notificados a los miembros con al menos 15 días de anticipación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Ley Aplicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta en los
              tribunales competentes de Colombia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para preguntas sobre estos términos, puede contactarnos en: info@fitzone.com.co o visitarnos en nuestras
              instalaciones.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
