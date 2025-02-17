import React, { useCallback, useState } from 'react';
import { Modal } from '@/app/components/Modal/Modal';
import useActiveConversation from '@/app/hooks/useActiveConversation';

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import es from 'react-phone-number-input/locale/es'

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

    const handlePhoneInputChange = useCallback((value?: string) => {
        setNewPhone(value || "");
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
                <PhoneInput
                    placeholder="Enter phone number"
                    value={newPhone}
                    onChange={handlePhoneInputChange}
                    labels={es} />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="second-button"
                    onClick={() => {
                        handleOpenModal(false)
                        handlePhoneInputChange("")
                    }}
                >
                    Cancelar
                </button>
                <CreateConversationButton />
            </div>
        </Modal>
    );
});

ModalCreateConversartion.displayName = 'Modal';
