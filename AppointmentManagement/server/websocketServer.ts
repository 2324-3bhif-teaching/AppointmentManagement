import { Server } from 'ws';

const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Neuer Client verbunden');

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());

        if (data.action === 'deleteQueue') {
            console.log(`Warteposition ${data.waitingPositionId} wurde gelöscht.`);
            // Senden Sie eine Nachricht an alle verbundenen Clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        action: 'deleteQueue',
                        waitingPositionId: data.waitingPositionId
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client getrennt');
    });

    ws.send('Willkommen beim WebSocket-Server!');
});

console.log('WebSocket-Server läuft auf ws://localhost:8080');