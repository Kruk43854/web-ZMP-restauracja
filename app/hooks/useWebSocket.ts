import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const getWebSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    return apiUrl.replace(/^http/, 'ws') + '/ws-qlc';
};

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const token = getCookie('token'); 
        const wsUrl = getWebSocketUrl();

        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            debug: function (str) {
                console.log('STOMP Debug: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('Połączono z serwerem WebSocket!');
            setIsConnected(true);
        };

        client.onStompError = (frame) => {
            console.error('Błąd STOMP: ' + frame.headers['message']);
            console.error('Dodatkowe info: ' + frame.body);
            setIsConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('Zakończono połączenie WebSocket');
            setIsConnected(false);
        };

        clientRef.current = client;
        client.activate();

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    // Główna funkcja do subskrybowania kanałów
    const subscribe = useCallback((topic: string, callback: (message: IMessage) => void) => {
        if (!clientRef.current || !clientRef.current.connected) {
            console.warn(`Nie można zasubskrybować ${topic}. Brak połączenia STOMP.`);
            return null;
        }

        const subscription = clientRef.current.subscribe(topic, (message) => {
            callback(message);
        });

        return subscription;
    }, []);

    return { isConnected, subscribe };
}