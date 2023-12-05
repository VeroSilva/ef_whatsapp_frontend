import { ChangeEvent, useState, KeyboardEvent } from "react";
import { IconX } from "../Icons/IconX";
import { MessageInteractive } from "../Message/MessageInteractive/MessageInteractive";

export const FormQuickReply = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [wordList, setWordList] = useState<string[]>([]);
    const [data, setData] = useState<any>({});
    const [activeTab, setActiveTab] = useState<string>("multi");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            setWordList((prevList) => [...prevList, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleSetData = (data: any) => {
        setData(data)
    }

    const handleDeleteWord = (index: number) => {
        setWordList((prevList) => prevList.filter((_, i) => i !== index));
    };

    return (
        <div className="flex gap-2">
            <div className="w-full md:w-1/2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleEnterPress}
                    placeholder="Escribe una palabra y presiona Enter"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                />

                <div className="w-full flex justify-center gap-2 flex-wrap mt-4">
                    {wordList.map((word, index) => (
                        <span key={index} className="bg-slate-200 rounded-md p-2 flex items-center justify-between">
                            {word}
                            <button
                                onClick={() => handleDeleteWord(index)}
                                className="hover:bg-slate-300 rounded-full ml-2"
                            >
                                <IconX classes="w-6 h-6" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="w-full md:w-1/2 bg-slate-200 p-2 rounded-md">
                <ul className="text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex w-full m-auto mb-4">
                    <button className="w-full" onClick={() => setActiveTab("multi")}>
                        <span className={`inline-block w-full p-4 border-r border-gray-200 font-semibold rounded-s-lg focus:ring-4 focus:ring-teal-300 focus:outline-none transition-all duration-200 ease-in-out ${activeTab === "multi" ? "bg-teal-500 text-slate-100" : "bg-gray-150"}`}>Multi productos</span>
                    </button>
                    <button className="w-full" onClick={() => setActiveTab("single")}>
                        <span className={`inline-block w-full p-4 border-s-0 border-gray-200 font-semibold rounded-e-lg focus:ring-4 focus:outline-none focus:ring-teal-300 transition-all duration-200 ease-in-out ${activeTab === "single" ? "bg-teal-500 text-slate-100" : "bg-gray-150"}`}>Producto único</span>
                    </button>
                </ul>

                <MessageInteractive handleSetData={handleSetData} activeTab={activeTab} />
            </div>
        </div>
    )
}