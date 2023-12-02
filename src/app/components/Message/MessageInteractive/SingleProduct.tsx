import { useEffect, useState } from "react";
import { Modal } from "@/app/components/Modal/Modal";
import { SelectCatalog } from "../../Chat/SelectCatalog/SelectCatalog";
import useCatalog from "@/app/hooks/useCatalog";

export const SingleProduct = ({ handleSetData, savedData }: { handleSetData: Function, savedData: any }) => {
    const { catalogState } = useCatalog();
    const [showModal, setShowModal] = useState<boolean>(false)
    const [product, setProduct] = useState<any>()
    const [interactiveSingleData, setInteractiveSingleData] = useState({
        type: "product",
        action: {
            product_retailer_id: "",
            catalog_id: "249532717895232"
        }
    })

    const handleOpenModal = () => {
        setShowModal(!showModal)
    }

    const handleSingleSelectChange = (option: any) => {
        setProduct(option);

        setInteractiveSingleData((prevInteractiveData: any) => ({
            ...prevInteractiveData,
            action: {
                ...prevInteractiveData.action,
                product_retailer_id: option.value,
                product_name: option.label
            }
        }));
    };

    useEffect(() => {
        handleSetData(interactiveSingleData)
    }, [interactiveSingleData])

    useEffect(() => {
        if (savedData && !!Object.keys(savedData).length) {
            setInteractiveSingleData(savedData)

            const currentProduct: any = catalogState.filter((catalog) => savedData.action.product_retailer_id === catalog.g_id)[0];

            if (currentProduct) {
                setProduct({
                    value: currentProduct.id,
                    label: currentProduct.title,
                    color: "#2dd4bf"
                })
            }
        }
    }, [])

    return (
        <>
            <div className='mb-4'>
                <div className='flex items-center'>
                    <label className="block text-gray-700 text-sm font-bold" htmlFor="interactive-body">
                        *Producto
                    </label>
                    <button
                        className='ml-2 rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-xs'
                        onClick={handleOpenModal}
                    >Elegir</button>
                </div>

                {product ?
                    <div className='flex flex-wrap gap-1 mt-2 w-[200px]'>
                        <span
                            className="bg-teal-200 text-teal-800 p-1 rounded-md"
                        >
                            {product.label}
                        </span>
                    </div> :
                    <span className='mt-2 block'>No ha seleccionado productos</span>
                }
            </div>

            <Modal
                title="Elije los productos"
                onClose={handleOpenModal}
                show={showModal}
                width="500px"
            >
                <div className='h-[400px]'>
                    <SelectCatalog handleChange={handleSingleSelectChange} selectedOptions={product} isMulti={false} />

                    <button
                        className='ml-2 mt-4 rounded-md bg-slate-600 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-lg'
                        onClick={handleOpenModal}
                    >Cerrar</button>
                </div>
            </Modal>
        </>
    )
}