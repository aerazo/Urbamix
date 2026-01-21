
import { getCustomers } from "@/app/actions/customers"
import { ClientManager } from "@/components/client-manager"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
    const customers = await getCustomers()

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <ClientManager initialClients={customers} />
            </div>
        </div>
    )
}
