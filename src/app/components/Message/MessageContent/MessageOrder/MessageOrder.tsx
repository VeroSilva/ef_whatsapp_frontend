import { MessageDetail } from "@/app/interfaces/conversations"

export const MessageOrder = ({ message }: { message: any }) => {
    const { json } = message

    return (
        <>
            {json &&
                <div>
                    {json.product_items.map((product: any, index: number) => (
                        <div key={`product-${index}`} className="mb-2">
                            <h3 className="font-semibold">Producto {index + 1}</h3>
                            <p><span className="text-teal-400">ID:</span> {product.product_retailer_id}</p>
                            <p><span className="text-teal-400">Precio:</span> {product.currency} {product.item_price}</p>
                            <p><span className="text-teal-400">Cantidad:</span> {product.quantity}</p>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}