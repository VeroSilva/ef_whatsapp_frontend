import { initialStateActiveMessageReply } from "@/app/context/activeMessageReply/ActiveMessageReplyProvider";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply";
import { EmojiDropdown } from "../EmojiDropdown/EmojiDropdown"

export const InputSendMessage = ({ handleSendMessage, setMessageToSend, messageToSend }: { handleSendMessage: Function, setMessageToSend: Function, messageToSend: string }) => {
    const { setActiveMessageReply } = useActiveMessageReply();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSendMessage("text", messageToSend, () => {
                setActiveMessageReply(initialStateActiveMessageReply)
            })
            setMessageToSend("")
        }
    }

    return (
        <div className="flex relative mx-4 w-full">
            <textarea
                className="h-full py-3 px-5 w-full form-control resize-none border border-gray-200 rounded shadow-none focus:border-gray-200 focus:ring-0"
                rows={1}
                placeholder="Escribe tu mensaje"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
            ></textarea>
            <EmojiDropdown setMessageToSend={setMessageToSend} messageToSend={messageToSend} />
        </div>

    )
}