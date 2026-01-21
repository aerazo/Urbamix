"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"
import type { Client } from "./client-form"

interface ClientListProps {
    clients: Client[]
    onEdit: (client: Client) => void
    onDelete: (id: number) => void
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
    if (clients.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                No hay clientes registrados. Agrega uno nuevo para comenzar.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {clients.map((client) => (
                    <Card key={client.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex justify-between items-start">
                                <span>{client.name}</span>
                                <span className="text-sm font-normal text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                                    {client.rut}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {/* Content minimized as requested */}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-2 border-t">
                            <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(client.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>RUT</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell className="font-medium">{client.rut}</TableCell>
                                <TableCell>{client.name}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(client)} title="Editar">
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(client.id)}
                                        title="Eliminar"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
