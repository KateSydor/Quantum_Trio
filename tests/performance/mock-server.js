/**
 * Mock server для performance тестів (k6)
 * Запуск: node tests/performance/mock-server.js
 */
const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/api/health') {
        res.writeHead(200);
        return res.end(JSON.stringify({ status: 'ok' }));
    }

    if (req.url === '/api/auth/login' && req.method === 'POST') {
        res.writeHead(200);
        return res.end(JSON.stringify({ token: 'mock-token-12345' }));
    }

    if (req.url === '/api/recipes') {
        res.writeHead(200);
        return res.end(JSON.stringify([
            { id: 1, title: 'Шпинатна фрітата', time: 20 },
            { id: 2, title: 'Омлет з фетою', time: 15 },
        ]));
    }

    if (req.url === '/api/recipes/generate' && req.method === 'POST') {
        res.writeHead(200);
        return res.end(JSON.stringify({ id: 3, title: 'Шпинатна фрітата з фетою' }));
    }

    if (req.url === '/api/users/me') {
        res.writeHead(200);
        return res.end(JSON.stringify({ id: 1, email: 'oleksiy@example.com', name: 'Олексій Коваль' }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`);
});