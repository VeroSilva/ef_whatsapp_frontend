import { MessageDetail } from "@/app/interfaces/conversations"

export const MessageInteractive = ({ message }: { message: MessageDetail }) => {
    const { json } = message

    return (
        <div>
            {
                json && json.header && json?.header?.text && (
                    <span className="block my-2 p-2 border-2 border-teal-200 rounded-md bg-green-300">{json?.header?.text}</span>
                )
            }
            {
                json && json.body && json?.body?.text && (
                    <p>{json?.body?.text}</p>
                )
            }
            {
                json && json.footer && json?.footer?.text && (
                    <span className="block text-xs my-2">{json?.footer?.text}</span>
                )
            }

            <button className="w-full text-sky-500 border-t-2 border-slate-400 pt-2 mt-2">Ver items</button>
        </div>
    )
}