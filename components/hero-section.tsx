import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <Image
        src="/hero-bg.jpg"
        alt="Fondo del gimnasio"
        fill
        priority
        className="object-cover opacity-30"
        sizes="100vw"
      />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-theme-primary">
          Transforma tu <span className="text-red-500">cuerpo</span>
        </h1>
        <p className="text-xl md:text-2xl text-theme-secondary mb-8">
          Tu camino hacia una vida más saludable comienza aquí
        </p>
      </div>
    </section>
  )
}