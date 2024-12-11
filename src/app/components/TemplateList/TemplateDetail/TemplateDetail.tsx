import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Template } from "@/app/interfaces/template";
import { IconChevron } from "../../Icons/IconChevron";
import { IconLink } from "../../Icons/IconLink";
import Image from "next/image"
import { getVariables } from "@/app/utils/fileType";

export const TemplateDetail = ({ template, setIsReadyToSend, setTemplateToSend }: { template: Template, setIsReadyToSend: Function, setTemplateToSend: Function }) => {
    const [inputsBodyVariables, setInputsBodyVariables] = useState([]);
    const [inputHeaderVariable, setInputHeaderVariable] = useState("");
    const [inputButtonVariable, setInputButtonVariable] = useState("");
    const [matchesBody, setMatchesBody] = useState<any>([]);
    const [matchesHeader, setMatchesHeader] = useState<any>([]);
    const headerData = template.components.filter((component) => component.type === "HEADER")[0];
    const bodyData = template.components.filter((component) => component.type === "BODY")[0];
    const buttonsData = template.components.filter((component) => component.type === "BUTTONS")[0];
    const buttonsUrl = buttonsData ? buttonsData.buttons.filter((button: any) => button.type === "URL" && button.example) : [];
    const templateIsEditable = headerData && headerData.example ||
        bodyData && bodyData.example ||
        buttonsData && !!buttonsUrl.length

    const handleInputHeaderChange = (value: string) => {
        setInputHeaderVariable(value)
    }

    const handleInputBodyChange = (value: string, index: number) => {
        setInputsBodyVariables(prevState => {
            const newState: any = [...prevState];
            newState[index] = value;
            return newState;
        });
    };

    const handleInputButtonsChange = (value: string) => {
        setInputButtonVariable(value);
    };

    const areInputsFilled = () => {
        if (
            (headerData && headerData.example && inputHeaderVariable === "") ||
            ((bodyData && bodyData.example && (bodyData.example.body_text[0].length !== inputsBodyVariables.length) || (inputsBodyVariables.findIndex((variable) => variable === "") !== -1))) ||
            (buttonsData && buttonsUrl.length && inputButtonVariable === "")
        ) return false
        else return true
    };

    useEffect(() => {
        template.components.map((component) => {
            if (component.example || (component.buttons && component.buttons.some((button: any) => "example" in button))) {
                if (component.type === "HEADER") {
                    if (component.example.header_handle) {
                        handleInputHeaderChange(component.example.header_handle[0])
                    } else if (component.example.header_text) {
                        handleInputHeaderChange(component.example.header_text[0])
                    }
                }
                else if (component.type === "BODY") {
                    component.example.body_text[0].map((text: string, index: number) => {
                        handleInputBodyChange(text, index)
                    })
                }
                else if (component.type === "BUTTONS") {
                    const itemWithExample = component.buttons.find((button: any) => "example" in button);
                    handleInputButtonsChange(itemWithExample.example[0])
                }
            }
        })
    }, [])

    useEffect(() => {
        setIsReadyToSend(false)

        if (areInputsFilled()) {
            setIsReadyToSend(true)

            setTemplateToSend({
                name: template.name,
                language: {
                    code: "es"
                },
                id: template.id,
                components: []
            })

            if (headerData && headerData.example) {
                const parameterData = headerData.format.toLowerCase() === "image" || headerData.format.toLowerCase() === "video" ? { link: inputHeaderVariable } : (headerData.format.toLowerCase() === "document" ? { link: inputHeaderVariable, filename: "Archivo PDF" } : inputHeaderVariable)

                setTemplateToSend((prevState: any) => ({
                    ...prevState,
                    components: [...prevState.components, {
                        type: headerData.type.toLowerCase(),
                        parameters: [
                            {
                                "type": headerData.format.toLowerCase(),
                                // "text": texto si fuera tipo texto
                                [headerData.format.toLowerCase()]: parameterData
                            }
                        ]
                    }]
                })
                )
            }

            if (bodyData && bodyData.example) {
                const parameterData = inputsBodyVariables.map((variable) => ({
                    type: "text",
                    text: variable
                }))

                setTemplateToSend((prevState: any) => ({
                    ...prevState,
                    components: [
                        ...prevState.components,
                        {
                            type: bodyData.type.toLowerCase(),
                            parameters: parameterData
                        },
                    ]
                }))
            }

            if (buttonsData && !!buttonsUrl.length) {
                setTemplateToSend((prevState: any) => ({
                    ...prevState,
                    components: [
                        ...prevState.components,
                        {
                            type: "button",
                            sub_type: "URL",
                            index: "0",
                            parameters: [
                                {
                                    type: "text",
                                    text: inputButtonVariable
                                }
                            ]
                        },
                    ]
                }))
            }
        } else {
            setIsReadyToSend(false)
        }
    }, [inputHeaderVariable, inputsBodyVariables, inputButtonVariable])

    useEffect(() => {
        const regex = /\{\{(\d+)\}\}/g;
        let match;
        let allMatchesBody: any = [];
        let allMatchesHeader: any = [];

        template.components.forEach(component => {
            if (component.type.toLowerCase() === "body") {
                const inputString = component.text ?? "";

                while ((match = regex.exec(inputString)) !== null) {
                    allMatchesBody.push(match[0]);
                }
            } else if (component.type.toLowerCase() === "header") {
                const inputString = component.text ?? "";

                while ((match = regex.exec(inputString)) !== null) {
                    allMatchesHeader.push(match[0]);
                }
            }
        });

        setMatchesBody(allMatchesBody);
        setMatchesHeader(allMatchesBody);
    }, [template.components]);

    return (
        <>
            <h3 className="mb-4 font-bold text-center text-slate-700">{template.name}</h3>

            <div className={"template-detail " + (templateIsEditable ? "grid grid-cols-2 grid-flow-row gap-8" : "flex justify-center")}>
                {templateIsEditable &&
                    <div className="mb-4">
                        {headerData && headerData.example &&
                            <>
                                <h3 className="font-semibold text-center mb-3 text-slate-700">HEADER</h3>

                                {headerData.format === "IMAGE" || headerData.format === "VIDEO" || headerData.format === "DOCUMENT" ?
                                    <input
                                        type="text"
                                        id="file-input-image"
                                        className="border border-slate-300 rounded-md m-2 w-full mb-6"
                                        placeholder="Link de imagen o documento"
                                        value={inputHeaderVariable ?? ""}
                                        onChange={e => handleInputHeaderChange(e.target.value)}
                                    /> :
                                    headerData.format === "TEXT" && headerData.example &&
                                    <div className="md:flex md:items-center mb-3">
                                        <div className="md:w-1/6">
                                            <label className="block text-gray-500 font-bold text-sm md:text-right mb-1 md:mb-0 pr-4">
                                                {"{{"}{1}{"}}"}
                                            </label>
                                        </div>
                                        <div className="md:w-5/6">
                                            <input
                                                type="text"
                                                value={inputHeaderVariable ?? ""}
                                                onChange={e => handleInputHeaderChange(e.target.value)}
                                                className="border border-slate-300 rounded-md my-2 w-full input-sky"
                                            />
                                        </div>
                                    </div>
                                }
                            </>
                        }

                        {bodyData && bodyData.example &&
                            <>
                                <h3 className="font-semibold text-center mb-3 text-slate-700">BODY</h3>

                                {matchesBody.map((match: any, index: number) => {
                                    return (
                                        <div className="md:flex md:items-center mb-3" key={`match-variable-${index}`}>
                                            <div className="md:w-1/6">
                                                <label className="block text-gray-500 font-bold text-sm md:text-right mb-1 md:mb-0 pr-4">
                                                    {"{{"}{index + 1}{"}}"}
                                                </label>
                                            </div>
                                            <div className="md:w-5/6">
                                                <input
                                                    key={`variable-${index}`}
                                                    type="text"
                                                    value={inputsBodyVariables[index] ?? ""}
                                                    onChange={e => handleInputBodyChange(e.target.value, index)}
                                                    className="border border-slate-300 rounded-md my-2 w-full input-sky"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </>
                        }

                        {buttonsData && !!buttonsUrl.length &&
                            <>
                                <h3 className="font-semibold text-center mb-3 text-slate-700">BUTTONS</h3>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder={`Link para: ${buttonsUrl[0].text}`}
                                        value={inputButtonVariable}
                                        onChange={e => handleInputButtonsChange(e.target.value)}
                                        className="border border-slate-300 rounded-md my-2 w-full input-sky"
                                    />
                                </div>
                            </>
                        }
                    </div>
                }

                <div className={"bg-slate-200 p-2 rounded shadow p-4 " + (!templateIsEditable ? "w-9/12" : "")}>
                    {template.components.map((component, index) => {
                        let HeaderComponent = null;
                        let BodyComponent = null;
                        let FooterComponent = null;
                        let ButtonsComponent = null;

                        switch (component.type.toLowerCase()) {
                            case "header":
                                switch (component.format.toLowerCase()) {
                                    case "image":
                                        HeaderComponent = (
                                            <div className="relative h-[180px]">
                                                <Image
                                                    src={component.example.header_handle[0]} //aquí va useState variable para que sea editable
                                                    width={300}
                                                    height={300}
                                                    alt="Imagen de template"
                                                    className="object-cover rounded-md w-full h-full"
                                                />
                                            </div>
                                        );
                                        break;
                                    case "text":
                                        const substrings = getVariables(component.text ?? "") //Solo puede ser una sola variable

                                        HeaderComponent = (
                                            <h3 className="text-center font-bold p-2">
                                                <React.Fragment key={index}>
                                                    {substrings[0]}
                                                    {component.example && <strong>{!!inputHeaderVariable.length ? inputHeaderVariable : matchesHeader[0]}</strong>}
                                                </React.Fragment>
                                            </h3>
                                        );
                                        break;

                                    default:
                                        break;
                                }
                                break;

                            case "body":
                                const substrings = getVariables(component.text ?? "")

                                BodyComponent = (
                                    <p className="py-4">
                                        {substrings.map((substring, index) => (
                                            <React.Fragment key={`body-item-${index}`}>
                                                {substring}
                                                {component.example && <strong>{inputsBodyVariables[index] ?? matchesBody[index]}</strong>}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                )

                                break;

                            case "footer":
                                FooterComponent = (
                                    <p className="pb-4 text-slate-500">{component.text}</p>
                                )
                                break;

                            case "buttons":
                                const buttons = component.buttons.map((button: any, buttonIndex: number) => {
                                    switch (button.type.toLowerCase()) {
                                        case "quick_reply":
                                            return <button key={`button-${buttonIndex}`} className="button text-sky-500">{button.text}</button>
                                            break;

                                        case "url":
                                            let url;

                                            if ("example" in button) {
                                                const regex = new RegExp(
                                                    `{{1}}`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                                                    "g"
                                                );

                                                url = button.url.replace(
                                                    regex,
                                                    button.example[0]
                                                );
                                            } else {
                                                url = button.url
                                            }

                                            return <button key={`button-${buttonIndex}`} className="button text-sky-500">
                                                <IconLink classes="w-6 h-6 mr-1 float-left" />
                                                {button.text}
                                            </button>
                                            break;

                                        default:
                                            break;
                                    }
                                })

                                ButtonsComponent = (
                                    <div className="buttons-container flex flex-wrap justify-around gap-2 border-t-2 border-slate-300 pt-2">
                                        {buttons}
                                    </div>
                                );

                                break;

                            default:
                                break;
                        }

                        return (
                            <div
                                key={`card-${index}`}
                            >
                                {HeaderComponent}
                                {BodyComponent}
                                {FooterComponent}
                                {ButtonsComponent}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}