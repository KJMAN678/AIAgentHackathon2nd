const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

//webサーバーを作る
const server = http.createServer((req, res) => {
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        // ファイルが見つからない場合
        res.writeHead(404);
        res.end('File not found');
      } else {
        // サーバーエラーの場合
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      // 成功した場合
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// サーバーを指定したポートで起動
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
