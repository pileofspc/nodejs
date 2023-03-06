const path = require('path');
const fs = require('fs');
const http = require('http');

const PATHS = new function() {
    this.dist = path.resolve('D:/GitHub/webpackCars/dist');
    this.src = path.resolve(this.dist, '../src');
    this.error404 = path.resolve(this.dist, 'error404.html');
    this.error500 = path.resolve(this.dist, 'error500.html');
}

let server = http.createServer();
const PORT = 3000;
// const IP = '192.168.1.10';
// const IP = '26.175.15.6';
const IP = '';

server.listen(PORT, IP, () => {
    console.log(`Server running on ip: ${IP}:${PORT}`);
});

server.on('request', (req, res) => {
    let filePath = path.join(PATHS.dist, req.url);   
    let extName = path.extname(filePath);
    if (!extName) {
        if(req.url === '/') {
            filePath = path.join(filePath, `index.html`);
        } else {
            filePath += '.html';
        }  
    }
    // Поддержка пробелов в URL
    filePath = filePath.replace(/%20/g, ' ');


    let contentType = 'text/html';

    switch (extName) {
        case '.js':
            contentType = 'text/javascript';
            break
        case '.css':
            contentType = 'text/css';
            break
        case '.json':
            contentType = 'application/json'
            break
        case '.svg':
            contentType = 'image/svg+xml';
            break
        case '.png':
            contentType = 'image/png';
            break
        case '.jpg':
            contentType = 'image/jpg';
            break
        case '.ico':
            contentType = 'image/x-icon';
            break
        
    }

    fs.readFile(filePath, (err, content)=>{
        if (err) {
            // При ошибке
            if (err.code === 'ENOENT') {
                // console.log(filePath);
                // 404
                res.writeHead(404, {'Content-Type': `text/html`});
                fs.readFile(PATHS.error404, (err, content)=>{
                    res.write(content, 'utf8', ()=>{
                        // console.log('error page sent to client');
                    });
                    res.end();
                });
            } else {
                // 500
                res.writeHead(500, {'Content-Type': `text/html`});
                fs.readFile(PATHS.error500, (err, content)=>{
                    res.write(content, 'utf8', ()=>{
                        // console.log('error page sent to client');
                    });
                    res.end();
                });
            }
        } else {
            // Успех
            res.writeHead(200, {'Content-Type': `${contentType}`});
            res.write(content, 'utf8', (err)=>{
                // console.log('file sent to client');
            });
            res.end();
        }
        
    });
});