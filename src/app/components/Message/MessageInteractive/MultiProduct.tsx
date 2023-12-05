import { useEffect, useState } from "react";
import { Modal } from "@/app/components/Modal/Modal";
import { SelectCatalog } from "../../Chat/SelectCatalog/SelectCatalog";
import useCatalog from "@/app/hooks/useCatalog";

export const MultiProduct = ({ handleSetData, savedData }: { handleSetData: Function, savedData: any }) => {
    const { catalogState } = useCatalog();
    const [showModal, setShowModal] = useState<boolean>(false)
    const [products, setProducts] = useState<any>([])
    const [interactiveMultiData, setInteractiveMultiData] = useState({
        body: {
            text: "Conoce aquí nuestros perfumes altamente concentrados y de gran duración👆🏼👀"
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
            text: "Escoge tu perfume aquí👋🏻"
        },
        header: {
            text: "",
            type: "text"
        }
    })

    const handleOpenModal = () => {
        setShowModal(!showModal)
    }

    const handleMultiSelectChange = (options: any) => {
        setProducts(options);

        const productsRetailers = options.map((option: any) => ({ product_retailer_id: option.value, product_name: option.label }));

        setInteractiveMultiData((prevInteractiveData: any) => ({
            ...prevInteractiveData,
            action: {
                ...prevInteractiveData.action,
                sections: prevInteractiveData.action.sections.map((section: any, index: number) => {
                    if (index === 0) {
                        return {
                            ...section,
                            product_items: productsRetailers
                        };
                    }
                    return section;
                })
            }
        }));
    };

    useEffect(() => {
        handleSetData(interactiveMultiData)
    }, [interactiveMultiData])

    useEffect(() => {
        if (savedData && !!Object.keys(savedData).length) {
            setInteractiveMultiData(savedData)

            const presentsProducts = catalogState.filter(producto => {
                return savedData.action.sections[0].product_items.some((productRetailer: any) => productRetailer.product_retailer_id === producto.g_id);
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
        <>
            <div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Título</label>
                    <input
                        id="interactive-title"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        placeholder="Título"
                        value={interactiveMultiData.action.sections[0].title}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            const truncatedValue = inputValue.substring(0, 24);

                            setInteractiveMultiData((prevInteractiveData: any) => ({
                                ...prevInteractiveData,
                                action: {
                                    ...prevInteractiveData.action,
                                    sections: [
                                        {
                                            title: truncatedValue,
                                            product_items: prevInteractiveData.action.sections[0].product_items
                                        }
                                    ]
                                }
                            }));
                        }}
                    />
                </div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Subtítulo</label>

                    <input
                        id="interactive-footer"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        placeholder="Subtítulo"
                        value={interactiveMultiData.header.text}
                        onChange={(e) => {
                            setInteractiveMultiData((prevInteractiveData: any) => ({
                                ...prevInteractiveData,
                                header: {
                                    ...prevInteractiveData.header,
                                    text: e.target.value
                                }
                            }));
                        }}
                    />
                </div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">*Descripción</label>

                    <textarea
                        required
                        id="interactive-body"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        rows={2}
                        placeholder="*Descripción del mensaje"
                        value={interactiveMultiData.body.text}
                        onChange={(e) => {
                            setInteractiveMultiData((prevInteractiveData: any) => ({
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
                    <div className='flex items-center'>
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="interactive-body">
                            *Productos
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
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interactive-body">Pie de página</label>

                    <input
                        id="interactive-footer"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg input-sky block w-full p-2.5"
                        placeholder="Pie de página"
                        value={interactiveMultiData.footer.text}
                        onChange={(e) => {
                            setInteractiveMultiData((prevInteractiveData: any) => ({
                                ...prevInteractiveData,
                                footer: {
                                    ...prevInteractiveData.footer,
                                    text: e.target.value
                                }
                            }));
                        }}
                    />
                </div>
                <small>Los campos con * son obligatorios</small>
            </div>

            <Modal
                title="Elije los productos"
                onClose={handleOpenModal}
                show={showModal}
                width="500px"
            >
                <div className='h-[400px]'>
                    <SelectCatalog handleChange={handleMultiSelectChange} selectedOptions={products} isMulti={true} />

                    <button
                        className='ml-2 mt-4 rounded-md bg-slate-600 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-lg'
                        onClick={handleOpenModal}
                    >Cerrar</button>
                </div>
            </Modal>
        </>
    )
}