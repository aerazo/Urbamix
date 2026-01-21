
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClientForm, type Client } from "@/components/client-form"
import { ClientList } from "@/components/client-list"
import { createCustomer, updateCustomer, deleteCustomer } from "@/app/actions/customers"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ... imports

interface ClientManagerProps {
    initialClients: Client[]
}

export function ClientManager({ initialClients }: ClientManagerProps) {
    const router = useRouter()
    const [clients, setClients] = useState<Client[]>(initialClients)
    const [isEditing, setIsEditing] = useState(false)
    const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    // Sync local state with server state when it changes
    useEffect(() => {
        setClients(initialClients)
    }, [initialClients])

    const handleCreate = () => {
        setCurrentClient(undefined)
        setIsEditing(true)
    }

    const handleEdit = (client: Client) => {
        setCurrentClient(client)
        setIsEditing(true)
    }

    const confirmDelete = (id: number) => {
        setDeleteId(id)
    }

    const handleDelete = async () => {
        if (deleteId) {
            await deleteCustomer(deleteId)
            router.refresh()
            setDeleteId(null)
        }
    }

    const handleSubmit = async (client: Omit<Client, "id"> | Client) => {
        try {
            if ("id" in client && client.id) {
                // Update existing
                await updateCustomer(client.id, client)
            } else {
                // Create new
                await createCustomer(client)
            }
            router.refresh() // Refresh server data
            setIsEditing(false)
            setCurrentClient(undefined)
        } catch (error) {
            console.error("Failed to save client", error)
            alert("Error al guardar cliente")
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setCurrentClient(undefined)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Mantenedor de Clientes</h1>
                {!isEditing && (
                    <Button onClick={handleCreate} className="bg-[#153A66] hover:bg-[#0F2942] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Cliente
                    </Button>
                )}
            </div>

            {isEditing ? (
                <ClientForm initialData={currentClient} onSubmit={handleSubmit} onCancel={handleCancel} />
            ) : (
                <ClientList clients={clients} onEdit={handleEdit} onDelete={confirmDelete} />
            )}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
