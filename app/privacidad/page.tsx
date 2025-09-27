"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function PrivacidadPage() {
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
          <h1 className="text-3xl font-bold text-center mb-2">Política de Privacidad</h1>
          <p className="text-center text-muted-foreground">FitZone Gimnasio</p>
          <p className="text-center text-sm text-muted-foreground">Última actualización: Enero 2025</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
            <p className="text-muted-foreground leading-relaxed">
              FitZone S.A.S., en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos
              personales, informa sobre el tratamiento que damos a sus datos personales y los derechos que tiene sobre
              los mismos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Responsable del Tratamiento</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Razón Social:</strong> FitZone S.A.S.
              </p>
              <p>
                <strong>NIT:</strong> 900.XXX.XXX-X
              </p>
              <p>
                <strong>Dirección:</strong> Calle XX # XX-XX, Bogotá, Colombia
              </p>
              <p>
                <strong>Teléfono:</strong> +57 (1) XXX-XXXX
              </p>
              <p>
                <strong>Email:</strong> privacidad@fitzone.com.co
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Datos Personales Recolectados</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>3.1 Datos de Identificación:</strong> Nombre completo, número de identificación, fecha de
                nacimiento, fotografía.
              </p>
              <p>
                <strong>3.2 Datos de Contacto:</strong> Dirección, teléfono, correo electrónico.
              </p>
              <p>
                <strong>3.3 Datos de Salud:</strong> Información médica relevante para el ejercicio físico, alergias,
                condiciones médicas.
              </p>
              <p>
                <strong>3.4 Datos Financieros:</strong> Información de pago y facturación.
              </p>
              <p>
                <strong>3.5 Datos Biométricos:</strong> Medidas corporales, progreso físico (con consentimiento
                expreso).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Finalidades del Tratamiento</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>4.1 Prestación del Servicio:</strong> Administrar membresías, acceso a instalaciones y servicios
                del gimnasio.
              </p>
              <p>
                <strong>4.2 Comunicaciones:</strong> Envío de información sobre servicios, promociones y actividades.
              </p>
              <p>
                <strong>4.3 Seguridad:</strong> Control de acceso y videovigilancia de las instalaciones.
              </p>
              <p>
                <strong>4.4 Salud y Bienestar:</strong> Seguimiento del progreso físico y recomendaciones
                personalizadas.
              </p>
              <p>
                <strong>4.5 Obligaciones Legales:</strong> Cumplimiento de obligaciones fiscales y regulatorias.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Derechos del Titular</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>5.1 Derecho de Acceso:</strong> Conocer qué datos personales tenemos sobre usted.
              </p>
              <p>
                <strong>5.2 Derecho de Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos.
              </p>
              <p>
                <strong>5.3 Derecho de Cancelación:</strong> Solicitar la eliminación de sus datos cuando no sean
                necesarios.
              </p>
              <p>
                <strong>5.4 Derecho de Oposición:</strong> Oponerse al tratamiento de sus datos en casos específicos.
              </p>
              <p>
                <strong>5.5 Derecho de Revocación:</strong> Retirar el consentimiento otorgado para el tratamiento.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Ejercicio de Derechos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para ejercer sus derechos, puede contactarnos a través de:
            </p>
            <div className="space-y-2 text-muted-foreground ml-4">
              <p>• Email: privacidad@fitzone.com.co</p>
              <p>• Teléfono: +57 (1) XXX-XXXX</p>
              <p>• Presencialmente en nuestras instalaciones</p>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Responderemos a su solicitud dentro de los 15 días hábiles siguientes a su recepción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Transferencia y Transmisión de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Sus datos personales pueden ser compartidos con terceros únicamente en los siguientes casos:
            </p>
            <div className="space-y-2 text-muted-foreground ml-4">
              <p>• Proveedores de servicios tecnológicos (con contratos de confidencialidad)</p>
              <p>• Entidades financieras para procesamiento de pagos</p>
              <p>• Autoridades competentes cuando sea requerido por ley</p>
              <p>• Profesionales de la salud (solo datos médicos relevantes y con consentimiento)</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Seguridad de los Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas, humanas y administrativas para proteger sus datos personales contra
              pérdida, alteración, acceso no autorizado o uso indebido. Estas incluyen cifrado, controles de acceso,
              capacitación del personal y auditorías regulares.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Conservación de Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conservaremos sus datos personales durante el tiempo necesario para cumplir con las finalidades descritas,
              y posteriormente durante los plazos establecidos por la normativa colombiana para efectos de archivo y
              cumplimiento de obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Cookies y Tecnologías Similares</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario, analizar el tráfico y
              personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar
              la funcionalidad del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">11. Menores de Edad</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para el tratamiento de datos de menores de edad, requerimos la autorización expresa de los padres o
              tutores legales, conforme a lo establecido en la normativa colombiana.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">12. Modificaciones a la Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Esta política puede ser modificada para adaptarse a cambios normativos o en nuestros servicios. Las
              modificaciones serán comunicadas a través de nuestros canales habituales con al menos 10 días de
              anticipación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">13. Autoridad de Control</h2>
            <p className="text-muted-foreground leading-relaxed">
              La Superintendencia de Industria y Comercio es la autoridad encargada de velar por el cumplimiento de la
              normativa de protección de datos personales en Colombia. Puede presentar quejas ante esta entidad si
              considera que sus derechos han sido vulnerados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">14. Consentimiento</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al utilizar nuestros servicios y proporcionar sus datos personales, usted otorga su consentimiento libre,
              previo, expreso e informado para el tratamiento de los mismos conforme a esta política de privacidad.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
