"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Users, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Bienvenido a <span className="text-[#153A66]">Urbamix</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Seleccione una de las siguientes opciones para continuar.
          </p>
        </div>

        <div className="flex justify-center w-full">
          <Link href="/quoter" className="group max-w-sm w-full">
            <Card className="h-full hover:shadow-lg transition-all border-[#153A66]/20 hover:border-[#153A66]">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4 pt-10">
                <div className="p-4 bg-[#E8EFF5] rounded-full group-hover:bg-[#153A66] transition-colors">
                  <Calculator className="w-8 h-8 text-[#153A66] group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">Cotizador</h2>
                  <p className="text-sm text-gray-500">
                    Genere cotizaciones de productos y servicios de manera rápida y eficiente.
                  </p>
                </div>
                <div className="pt-4 text-[#153A66] font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ir al Cotizador <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* <Link href="/customers" className="group">
            <Card className="h-full hover:shadow-lg transition-all border-gray-200 hover:border-gray-300">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4 pt-10">
                <div className="p-4 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                  <Users className="w-8 h-8 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">Mantenedor de Clientes</h2>
                  <p className="text-sm text-gray-500">
                    Administre la base de datos de clientes, obras y contactos.
                  </p>
                </div>
                <div className="pt-4 text-gray-500 font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ir a Clientes <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link> */}
        </div>
      </div>
    </div>
  )
}
