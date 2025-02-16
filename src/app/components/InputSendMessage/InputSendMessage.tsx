import { initialStateActiveMessageReply } from "@/app/context/activeMessageReply/ActiveMessageReplyProvider";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply";
import { EmojiDropdown } from "../EmojiDropdown/EmojiDropdown"

export const InputSendMessage = ({ handleSendMessage, setMessageToSend, messageToSend }: { handleSendMessage: Function, setMessageToSend: Function, messageToSend: string }) => {
    const { setActiveMessageReply } = useActiveMessageReply();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && messageToSend.trim() !== '') {
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
            <EmojiDropdown setMessageToSend={setMessageToSend} messageToSend={messageToSend} containerStyles="absolute top-0 bottom-0 right-5 w-9 h-9 my-[auto] mx-0" emojiStyles="w-9 h-9 text-teal-600" />
        </div>
    )
}