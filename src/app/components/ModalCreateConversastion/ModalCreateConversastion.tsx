import React, { useCallback, useState } from 'react';
import { Modal } from '@/app/components/Modal/Modal';
import useActiveConversation from '@/app/hooks/useActiveConversation';

interface ModalProps {
    show: boolean;
    handleOpenModal: Function;
}

export const ModalCreateConversartion: React.FC<ModalProps> = React.memo(({ show, handleOpenModal }) => {
    //@ts-ignore
    const { setActiveConversation } = useActiveConversation();
    const [newPhone, setNewPhone] = useState<string>("");

    const handleCreateConversation = useCallback(() => {
        setActiveConversation({
            contact: {
                country: "",
                email: "",
                name: "",
                phone: newPhone,
                tag_id: "",
                id: 0,
            },
            id: -1,
            tags: []
        });

        handleOpenModal(false);
    }, [newPhone]);

    const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPhone(e.target.value);
    }, []);

    const CreateConversationButton = () => (
        <button
            onClick={handleCreateConversation}
            className={
                "main-button transition ease-in-out delay-50 mb-4" +
                (newPhone === "" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-teal-600 hover:text-white")
            }
            disabled={newPhone === ""}
        >
            Crear conversación
        </button>
    );

    if (!show) return null;

    return (
        <Modal
            title="Crear nueva conversación"
            onClose={() => handleOpenModal(false)}
            show={show}
            width="500px"
        >
            <div className="flex flex-col space-y-4">
                <label htmlFor="phone" className="text-sm text-gray-800 font-semibold">
                    Número de teléfono:
                </label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Ingresa el número de teléfono"
                    className="border border-gray-300 rounded-lg p-2 input-sky"
                    value={newPhone}
                    onChange={handlePhoneChange}
                />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="second-button"
                    onClick={() => handleOpenModal(false)}
                >
                    Cancelar
                </button>
                <CreateConversationButton />
            </div>
        </Modal>
    );
});

ModalCreateConversartion.displayName = 'Modal';
