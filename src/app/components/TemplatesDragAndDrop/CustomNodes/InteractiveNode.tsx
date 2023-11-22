import { FC, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Modal } from "@/app/components/Modal/Modal";
import { SelectCatalog } from '../../Chat/SelectCatalog/SelectCatalog';
import useCatalog from '@/app/hooks/useCatalog';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const InteractiveNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [products, setProducts] = useState<any>([])
    const { savedInteractive, handleInteractivesChange, id } = data
    const { catalogState } = useCatalog();
    const [interactiveData, setInteractiveData] = useState({
        body: {
            text: ""
        },
        type: "product_list",
        action: {
            sections: [
                {
                    title: "",
                    product_items: []
                }
            ],
            catalog_id: "249532717895232"
        },
        footer: {
            text: ""
        },
        header: {
            text: "",
            type: "text"
        }
    })

    const handleOpenModal = () => {
        setShowModal(!showModal)
    }

    const handleSelectChange = (options: any) => {
        setProducts(options);

        const productsRetailers = options.map((option: any) => ({ product_retailer_id: option.value }));

        setInteractiveData(prevInteractiveData => ({
            ...prevInteractiveData,
            action: {
                ...prevInteractiveData.action,
                sections: prevInteractiveData.action.sections.map((section: any, index: number) => {
                    if (index === 0) {
                        // Solo actualiza la sección relevante
                        return {
                            ...section,
                            product_items: productsRetailers
                        };
                    }
                    // Mantén las demás secciones sin cambios
                    return section;
                })
            }
        }));
    };

    const isDisabled = () => {
        if (
            interactiveData.body.text !== "" &&
            interactiveData.action.sections[0].title !== "" &&
            !!interactiveData.action.sections[0].product_items.length &&
            interactiveData.footer.text !== "" &&
            interactiveData.header.text !== ""
        ) return false
        else return true
    }

    const handleSaveInteractive = () => {
        handleInteractivesChange(id, interactiveData)
    }

    useEffect(() => {
        if (!!Object.keys(savedInteractive).length) {
            setInteractiveData(savedInteractive)

            const presentsProducts = catalogState.filter(producto => {
                return savedInteractive.action.sections[0].product_items.some((productRetailer: any) => productRetailer.product_retailer_id === producto.id);
            });
            const optionsProducts = presentsProducts.map((prod) => ({
                value: prod.id,
                label: prod.title,
                color: "#2dd4bf"
            }))

            setProducts(optionsProducts)
        }
    }, [])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="manually" isConnectable={isConnectable} />

            <div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Body</label>

                    <textarea
                        id="interactive-body"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        rows={2}
                        placeholder="Body del mensaje"
                        value={interactiveData.body.text}
                        onChange={(e) => {
                            setInteractiveData(prevInteractiveData => ({
                                ...prevInteractiveData,
                                body: {
                                    ...prevInteractiveData.body,
                                    text: e.target.value
                                }
                            }));
                        }}
                    />
                </div>

                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Título de sección</label>

                    <input
                        id="interactive-title"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        placeholder="Título de sección"
                        value={interactiveData.action.sections[0].title}
                        onChange={(e) => {
                            setInteractiveData(prevInteractiveData => ({
                                ...prevInteractiveData,
                                action: {
                                    ...prevInteractiveData.action,
                                    sections: [
                                        {
                                            title: e.target.value,
                                            product_items: prevInteractiveData.action.sections[0].product_items
                                        }
                                    ]
                                }
                            }));
                        }}
                    />
                </div>

                <div className='mb-4'>
                    <div className='flex items-center'>
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="interactive-body">
                            Productos
                        </label>
                        <button
                            className='ml-2 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-xs'
                            onClick={handleOpenModal}
                        >Elegir</button>
                    </div>

                    {!!products.length ?
                        <div className='flex flex-wrap gap-1 mt-2 w-[200px]'>
                            {products.map((product: any, index: number) => (
                                <span
                                    key={`product-${index}`}
                                    className="bg-teal-200 text-teal-800 p-1 rounded-md"
                                >
                                    {product.label}
                                </span>
                            ))}
                        </div> :
                        <span className='mt-2 block'>No ha seleccionado productos</span>
                    }
                </div>

                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Footer</label>

                    <input
                        id="interactive-footer"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        placeholder="Footer del mensaje"
                        value={interactiveData.footer.text}
                        onChange={(e) => {
                            setInteractiveData(prevInteractiveData => ({
                                ...prevInteractiveData,
                                footer: {
                                    ...prevInteractiveData.footer,
                                    text: e.target.value
                                }
                            }));
                        }}
                    />
                </div>

                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Header</label>

                    <input
                        id="interactive-footer"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        placeholder="Header del mensaje"
                        value={interactiveData.header.text}
                        onChange={(e) => {
                            setInteractiveData(prevInteractiveData => ({
                                ...prevInteractiveData,
                                header: {
                                    ...prevInteractiveData.header,
                                    text: e.target.value
                                }
                            }));
                        }}
                    />
                </div>

                <div className='mt-4 flex justify-center'>
                    <button
                        className='rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-xs disabled:opacity-50'
                        onClick={handleSaveInteractive}
                        disabled={isDisabled()}
                    >Aceptar</button>
                </div>
            </div>

            <Modal
                title="Elije los productos"
                onClose={handleOpenModal}
                show={showModal}
                width="500px"
            >
                <div className='h-[400px]'>
                    <SelectCatalog handleChange={handleSelectChange} selectedOptions={products} />

                    <button
                        className='ml-2 mt-4 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-lg'
                        onClick={handleOpenModal}
                    >Aceptar</button>
                </div>
            </Modal>

            <Handle
                type="source"
                position={Position.Bottom}
                id="manually"
                isConnectable={isConnectable}
            />
        </div>
    );
};


export default InteractiveNode