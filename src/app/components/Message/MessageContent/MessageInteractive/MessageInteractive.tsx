import { MessageDetail } from "@/app/interfaces/conversations"

export const MessageInteractive = ({ message }: { message: MessageDetail }) => {
    const { json } = message

    return (
        <div>
            {
                json && json.action && json?.action?.sections && !!json?.action?.sections.length && json?.action?.sections[0].title && (
                    <>
                        <h3 className="font-semibold mt-2 text-cyan-800">Título:</h3>
                        <p>{json?.action?.sections[0].title}</p>
                    </>
                )
            }

            {
                json && json.header && json?.header?.text && (
                    <>
                        <h3 className="font-semibold mt-2 text-cyan-800">Subtítulo:</h3>
                        <p>{json?.header?.text}</p>
                    </>
                )
            }
            {
                json && json.body && json?.body?.text && (
                    <>
                        <h3 className="font-semibold mt-2 text-cyan-800">Descripción:</h3>
                        <p>{json?.body?.text}</p>
                    </>
                )
            }
            {
                json && json.footer && json?.footer?.text && (
                    <>
                        <h3 className="font-semibold mt-2 text-cyan-800">Pie de Página:</h3>
                        <p>{json?.footer?.text}</p>
                    </>
                )
            }

            <h3 className="font-semibold mt-2 text-cyan-800">{json?.type === "product_list" ? "🛒 Lista de productos:" : "🛒 Producto:"}</h3>

            {
                json?.type === "product_list" &&
                <ul className="mt-2">
                    {

                        json?.action?.sections[0].product_items.map((product: any, index: number) => {
                            return (
                                <li key={`product-interactive-${index}`} className="mb-1">• {product.product_name}</li>
                            )
                        })
                    }
                </ul>
            }

            {
                json?.type === "product" && <span className="mt-2">{json?.action?.product_name}</span>
            }
        </div>
    )
}