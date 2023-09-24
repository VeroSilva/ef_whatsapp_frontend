import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client'; // Importa el tipo Socket desde los tipos @types/socket.io-client

const SocketContext = createContext<{ socketInstance: Socket | null; setSocketInstance: (socketInstance: Socket | null) => void } | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

    return (
        <SocketContext.Provider value={{ socketInstance: socketInstance, setSocketInstance }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};