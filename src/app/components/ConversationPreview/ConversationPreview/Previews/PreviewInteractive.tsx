import React, { useEffect } from "react"
import { useState } from "react"
import { PreviewActions } from "../../PreviewActions"
import { MessageInteractive } from "@/app/components/Message/MessageInteractive/MessageInteractive"

export const PreviewInteractive = ({ handleSendMessage, isLoading, handleClosePreview }: { handleSendMessage: Function, isLoading: boolean, handleClosePreview: Function }) => {
    const [isReadyToSend, setIsReadyToSend] = useState(false)
    const [data, setData] = useState<any>({})
    const [activeTab, setActiveTab] = useState<string>("multi")

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
        if (activeTab === "multi") {
            if (
                data.body.text !== "" &&
                !!data.action.sections[0].product_items.length
            ) return false
            else return true
        } else if (activeTab === "single") {
            if (
                data.action.product_retailer_id !== ""
            ) return false
            else return true
        }
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
                <ul className="text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex w-1/2 m-auto mb-4">
                    <button className="w-full" onClick={() => setActiveTab("multi")}>
                        <span className={`inline-block w-full p-4 border-r border-gray-200 font-semibold rounded-s-lg focus:ring-4 focus:ring-teal-300 focus:outline-none transition-all duration-200 ease-in-out ${activeTab === "multi" ? "bg-teal-500 text-slate-100" : "bg-gray-150"}`}>Multi productos</span>
                    </button>
                    <button className="w-full" onClick={() => setActiveTab("single")}>
                        <span className={`inline-block w-full p-4 border-s-0 border-gray-200 font-semibold rounded-e-lg focus:ring-4 focus:outline-none focus:ring-teal-300 transition-all duration-200 ease-in-out ${activeTab === "single" ? "bg-teal-500 text-slate-100" : "bg-gray-150"}`}>Producto único</span>
                    </button>
                </ul>

                <MessageInteractive handleSetData={handleSetData} activeTab={activeTab} />
            </div>

            <PreviewActions handleAccept={handleAccept} handleCancel={handleCancel} isLoading={isLoading} isReadyToSend={isReadyToSend} />
        </>
    )
}