"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Printer, Download } from "lucide-react"
import Image from "next/image"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import { getCustomerByRut } from "@/app/actions/customers"

interface Product {
    id: string
    producto: string
    cantidad: string | number
    precioUf: string | number
}

interface ClientData {
    rutCliente: string
    nombreCliente: string
    obra: string
    fechaSimulacion: string
    fechaUf: string
    valorUf: string | number
}

export default function CotizacionGenerator() {
    const companyData = {
        rut: "78.319.423-6",
        nombre: "DISTRIBUIDORA DE HORMIGÓN Y MATERIALES DE CONSTRUCCIÓN SPA.",
        direccion: "PJ. MA ROSARIO TORO 1204, BARRIO MODELO IV, TALAGANTE.",
        telefono: "N/A",
        giro: "Compra de materiales de construcción y reventa a clientes finales.",
    }

    const [clientData, setClientData] = useState<ClientData>({
        rutCliente: "",
        nombreCliente: "",
        obra: "",
        fechaSimulacion: "",
        fechaUf: "",
        valorUf: "",
    })

    const [products, setProducts] = useState<Product[]>([
        { id: "1", producto: "", cantidad: "", precioUf: "" },
    ])



    const handleRutBlur = async () => {
        if (!clientData.rutCliente) return

        try {
            const client = await getCustomerByRut(clientData.rutCliente)
            if (client) {
                setClientData((prev) => ({
                    ...prev,
                    nombreCliente: client.name,
                }))
            }
        } catch (error) {
            console.error("Error fetching client:", error)
        }
    }

    const addProduct = () => {
        setProducts([
            ...products,
            {
                id: Date.now().toString(),
                producto: "",
                cantidad: "",
                precioUf: "",
            },
        ])
    }

    const removeProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id))
    }

    const updateProduct = (id: string, field: keyof Product, value: string | number) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
    }

    const calculateTotals = () => {
        const totalUf = products.reduce((sum, p) => {
            const cantidad = typeof p.cantidad === "string" ? Number.parseFloat(p.cantidad) || 0 : p.cantidad
            const precioUf = typeof p.precioUf === "string" ? Number.parseFloat(p.precioUf) || 0 : p.precioUf
            return sum + cantidad * precioUf
        }, 0)

        const valorUfNum = typeof clientData.valorUf === "string" ? Number.parseFloat(clientData.valorUf) || 0 : clientData.valorUf
        const totalNeto = totalUf * valorUfNum
        const totalIva = totalNeto * 0.19
        const totalConIva = totalNeto + totalIva

        return { totalNeto, totalIva, totalConIva, totalUf }
    }

    const { totalNeto, totalIva, totalConIva, totalUf } = calculateTotals()

    const handlePrint = () => {
        window.print()
    }

    const handleDownloadPDF = async () => {
        const input = document.getElementById('cotizacion')
        if (!input) return

        try {
            const dataUrl = await toPng(input, {
                cacheBust: true,
                backgroundColor: "#ffffff",
                pixelRatio: 2 // Higher quality
            })

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            // Calculate dimensions to fit A4
            const imgProperties = pdf.getImageProperties(dataUrl)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight)

            const fileName = `cotizacion-${clientData.rutCliente || 'borrador'}.pdf`
            pdf.save(fileName)
        } catch (error) {
            console.error("Error generating PDF:", error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-sm">
            {/* Print Button - Hidden on print */}
            <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-lg font-semibold text-gray-900">Generador de Cotizaciones</h1>
                    <div className="flex gap-2">
                        <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="border-[#153A66] text-[#153A66] hover:bg-[#153A66] hover:text-white">
                            <Download className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Descargar PDF</span>
                        </Button>
                        <Button onClick={handlePrint} size="sm" className="bg-[#153A66] hover:bg-[#0F2942]">
                            <Printer className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Imprimir</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8">
                {/* Editable Form - Hidden on print */}
                <div className="print:hidden mb-8 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-base font-semibold mb-4 text-[#153A66]">Datos del Cliente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="rutCliente" className="text-sm">
                                    RUT Cliente
                                </Label>
                                <Input
                                    id="rutCliente"
                                    value={clientData.rutCliente}
                                    onChange={(e) => setClientData({ ...clientData, rutCliente: e.target.value })}
                                    onBlur={handleRutBlur}
                                    className="text-sm"
                                    placeholder="Ej: 76.799.531-8"
                                />
                            </div>
                            <div>
                                <Label htmlFor="nombreCliente" className="text-sm">
                                    Cliente
                                </Label>
                                <Input
                                    id="nombreCliente"
                                    value={clientData.nombreCliente}
                                    onChange={(e) => setClientData({ ...clientData, nombreCliente: e.target.value })}
                                    className="text-sm"
                                    placeholder="Nombre del cliente o empresa"
                                />
                            </div>
                            <div>
                                <Label htmlFor="obra" className="text-sm">
                                    Obra
                                </Label>
                                <Input
                                    id="obra"
                                    value={clientData.obra}
                                    onChange={(e) => setClientData({ ...clientData, obra: e.target.value })}
                                    className="text-sm"
                                    placeholder="Nombre de la obra"
                                />
                            </div>
                            <div>
                                <Label htmlFor="fechaSimulacion" className="text-sm">
                                    Fecha Simulación
                                </Label>
                                <Input
                                    id="fechaSimulacion"
                                    type="date"
                                    value={clientData.fechaSimulacion}
                                    onChange={(e) => setClientData({ ...clientData, fechaSimulacion: e.target.value })}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="fechaUf" className="text-sm">
                                    Fecha UF
                                </Label>
                                <Input
                                    id="fechaUf"
                                    type="date"
                                    value={clientData.fechaUf}
                                    onChange={(e) => setClientData({ ...clientData, fechaUf: e.target.value })}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <Label htmlFor="valorUf" className="text-sm">
                                    Valor UF
                                </Label>
                                <Input
                                    id="valorUf"
                                    type="number"
                                    step="0.01"
                                    value={clientData.valorUf}
                                    onChange={(e) => setClientData({
                                        ...clientData,
                                        valorUf: e.target.value === "" ? "" : Number.parseFloat(e.target.value)
                                    })}
                                    className="text-sm"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-base font-semibold text-[#153A66]">Productos</h2>
                            <Button onClick={addProduct} variant="outline" size="sm" className="text-sm bg-transparent">
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Producto
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {products.map((product, index) => (
                                <div key={product.id} className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Label htmlFor={`producto-${product.id}`} className="text-sm">
                                            Producto
                                        </Label>
                                        <Input
                                            id={`producto-${product.id}`}
                                            value={product.producto}
                                            onChange={(e) => updateProduct(product.id, "producto", e.target.value)}
                                            placeholder="Nombre del producto"
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="w-24">
                                        <Label htmlFor={`cantidad-${product.id}`} className="text-sm">
                                            Cantidad
                                        </Label>
                                        <Input
                                            id={`cantidad-${product.id}`}
                                            type="number"
                                            step="1"
                                            value={product.cantidad}
                                            onChange={(e) =>
                                                updateProduct(
                                                    product.id,
                                                    "cantidad",
                                                    e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                                                )
                                            }
                                            placeholder="0"
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <Label htmlFor={`precioUf-${product.id}`} className="text-sm">
                                            Precio UF
                                        </Label>
                                        <Input
                                            id={`precioUf-${product.id}`}
                                            type="number"
                                            step="0.01"
                                            value={product.precioUf}
                                            onChange={(e) =>
                                                updateProduct(
                                                    product.id,
                                                    "precioUf",
                                                    e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                                                )
                                            }
                                            placeholder="0.00"
                                            className="text-sm"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeProduct(product.id)}
                                        disabled={products.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Printable Quote */}
                <div className="bg-white shadow-lg print:shadow-none" id="cotizacion">
                    {/* Header */}
                    <div className="bg-[#153A66] text-white p-6 print:p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Image src="/logo.png" alt="Urbamix SPA Logo" width={150} height={150} className="rounded-full" />
                                <div className="space-y-1 text-xs">
                                    <p className="font-bold text-sm">{companyData.nombre}</p>
                                    <p>RUT: {companyData.rut}</p>
                                    <p>DIRECCION: {companyData.direccion}</p>
                                    <p>TELEFONO: {companyData.telefono}</p>
                                    <p>GIRO: {companyData.giro}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="bg-[#E8EFF5] text-[#0F2942] text-center py-3 print:py-2">
                        <h2 className="text-lg font-bold">SIMULACION DE PAGO</h2>
                    </div>

                    {/* Client Info */}
                    <div className="p-6 print:p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-b-2 border-[#153A66] text-xs">
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <span className="font-semibold min-w-32">RUT CLIENTE:</span>
                                <span>{clientData.rutCliente}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold min-w-32">CLIENTE:</span>
                                <span>{clientData.nombreCliente}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold min-w-32">OBRA:</span>
                                <span>{clientData.obra}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <span className="font-semibold min-w-40">FECHA SIMULACION:</span>
                                <span>{clientData.fechaSimulacion ? new Date(clientData.fechaSimulacion).toLocaleDateString("es-CL") : ""}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold min-w-40">FECHA UF:</span>
                                <span>{clientData.fechaUf ? new Date(clientData.fechaUf).toLocaleDateString("es-CL") : ""}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold min-w-40">VALOR UF:</span>
                                <span>{typeof clientData.valorUf === "number" ? "$" + clientData.valorUf.toLocaleString("es-CL", { minimumFractionDigits: 2 }) : ""}</span>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="p-6 print:p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#153A66] text-white">
                                        <th className="border border-gray-300 p-2 text-left">Producto</th>
                                        <th className="border border-gray-300 p-2 text-center">Cantidad</th>
                                        <th className="border border-gray-300 p-2 text-right">Precio UF</th>
                                        <th className="border border-gray-300 p-2 text-right">Monto UF</th>
                                        <th className="border border-gray-300 p-2 text-right">Monto Neto</th>
                                        <th className="border border-gray-300 p-2 text-right">IVA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const cantidad =
                                            typeof product.cantidad === "string" ? Number.parseFloat(product.cantidad) || 0 : product.cantidad
                                        const precioUf =
                                            typeof product.precioUf === "string" ? Number.parseFloat(product.precioUf) || 0 : product.precioUf
                                        const montoUf = cantidad * precioUf

                                        const valorUfNum = typeof clientData.valorUf === "string" ? Number.parseFloat(clientData.valorUf) || 0 : clientData.valorUf
                                        const montoNeto = montoUf * valorUfNum
                                        const iva = montoNeto * 0.19

                                        return (
                                            <tr key={product.id}>
                                                <td className="border border-gray-300 p-2">{product.producto}</td>
                                                <td className="border border-gray-300 p-2 text-center">{cantidad}</td>
                                                <td className="border border-gray-300 p-2 text-right">{precioUf.toFixed(2)}</td>
                                                <td className="border border-gray-300 p-2 text-right">{montoUf.toFixed(2)}</td>
                                                <td className="border border-gray-300 p-2 text-right">
                                                    ${Math.round(montoNeto).toLocaleString("es-CL")}
                                                </td>
                                                <td className="border border-gray-300 p-2 text-right">
                                                    ${Math.round(iva).toLocaleString("es-CL")}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 flex justify-end">
                            <div className="space-y-2 min-w-80 text-xs">
                                <div className="flex justify-between border-b border-gray-300 pb-2">
                                    <span className="font-semibold">TOTAL UF:</span>
                                    <span>{totalUf.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-300 pb-2">
                                    <span className="font-semibold">TOTAL NETO:</span>
                                    <span>${Math.round(totalNeto).toLocaleString("es-CL")}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-300 pb-2">
                                    <span className="font-semibold">TOTAL IVA:</span>
                                    <span>${Math.round(totalIva).toLocaleString("es-CL")}</span>
                                </div>
                                <div className="flex justify-between border-b-2 border-[#153A66] pb-2 font-bold">
                                    <span>TOTAL IVA INCLUIDO:</span>
                                    <span>${Math.round(totalConIva).toLocaleString("es-CL")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">SALDO ANTERIOR:</span>
                                    <span>$ 0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Info */}
                    <div className="p-6 print:p-4 bg-gray-50">
                        <h3 className="font-bold text-[#153A66] mb-4 text-sm">CONDICIONES COMERCIALES</h3>
                        <p className="mb-4 text-xs">- PAGO ANTICIPADO</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded border border-[#153A66]">
                                <h4 className="font-bold text-[#153A66] mb-2 text-xs">DATOS PARA TRANSFERENCIA</h4>
                                <div className="space-y-1 text-xs">
                                    <p>Rut: {companyData.rut}</p>
                                    <p>{companyData.nombre}</p>
                                    <p>Banco: -</p>
                                    <p>Tipo de Cuenta: -</p>
                                    <p>Número: -</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded border border-[#153A66]">
                                <h4 className="font-bold text-[#153A66] mb-2 text-xs">DATOS PARA TRANSFERENCIA</h4>
                                <div className="space-y-1 text-xs">
                                    <p>Rut: {companyData.rut}</p>
                                    <p>{companyData.nombre}</p>
                                    <p>Banco: -</p>
                                    <p>Tipo de Cuenta: -</p>
                                    <p>Número: -</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="p-6 print:p-4 border-t-2 border-[#153A66]">
                        <h4 className="font-bold text-[#153A66] mb-3 text-sm">Nota:</h4>
                        <div className="space-y-1 text-xs">
                            <p>Debe solicitar el hormigón con un día de anticipación antes de las 16:00 hrs.</p>
                            <p>Horario de pago hasta las 16:00 hrs. después de ese horario no se asegura el equipo o el hormigón.</p>
                            <p>Sí no está cancelado su pedido será anulado por no pago.</p>
                            <p>-- Tiempo de descarga 8 min. por m3 o según frecuencia solicitada.</p>
                            <p>-- Enviar comprobante de transferencia o depósito.</p>
                            <p>-- Los servicios podrán ser anulados hasta las 12:00 hrs del día anterior.</p>
                            <p>-- Considerar 4mt de ancho x 4 mts alto para la entrada de camión.</p>
                            <p>-- Considerar cemento para el cebado de las tuberías de la bomba.</p>
                            <p>-- Despacho los días sábado hasta las 13:00 hrs. En obra.</p>
                            <p>
                                -- El cliente debe contar con los permisos municipales necesarios para el uso de aceras y/o calzadas.
                            </p>
                            <p>-- Sector de lavado y agua suficiente para el lavado de camión Mixer, tuberías y bomba</p>
                            <p>-- Anulaciones, cambio de horario, cambio de producto etc. son con 3 horas de anticipación.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
