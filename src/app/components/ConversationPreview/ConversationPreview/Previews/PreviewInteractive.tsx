import React, { useEffect } from "react"
import { useState } from "react"
import { PreviewActions } from "../../PreviewActions"
import { MessageInteractive } from "@/app/components/Message/MessageInteractive/MessageInteractive"

export const PreviewInteractive = ({ handleSendMessage, isLoading, handleClosePreview }: { handleSendMessage: Function, isLoading: boolean, handleClosePreview: Function }) => {
    const [isReadyToSend, setIsReadyToSend] = useState(false)
    const [data, setData] = useState<any>({})

    const handleAccept = () => {
        handleSendMessage("interactive", data)
    }

    const handleCancel = () => {
        handleClosePreview()
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAccept();
        }
    }

    const isDisabled = () => {
        if (
            data.body.text !== "" &&
            !!data.action.sections[0].product_items.length
        ) return false
        else return true
    }

    const handleSetData = (data: any) => {
        setData(data)
    }

    useEffect(() => {
        if (!!Object.keys(data).length) {
            if (isDisabled()) setIsReadyToSend(false)
            else setIsReadyToSend(true)
        }
    }, [data])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <>
            <div className="bg-slate-100 rounded border border-slate-300 w-full p-8 overflow-auto">
                <MessageInteractive handleSetData={handleSetData} />
            </div>

            <PreviewActions handleAccept={handleAccept} handleCancel={handleCancel} isLoading={isLoading} isReadyToSend={isReadyToSend} />
        </>
    )
}