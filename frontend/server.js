const http = require("http");
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const PORT = 3000;

let lastApiResponse = 'No data yet';

// 外部APIからデータを取得する関数
async function fetchApiData(imageUrl) {
  try {
    const url = imageUrl 
      ? `http://backend:8080/api/hello?image=${encodeURIComponent(imageUrl)}`
      : 'http://backend:8080/api/hello';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    lastApiResponse = data;
    return data;
  } catch (err) {
    console.error('Error fetching API data:', err);
    return `Error fetching API data: ${err.message}`;
  }
}

// 5秒ごとにAPIを呼び出す関数
async function periodicApiCall() {
  try {
    const canvas = document.getElementById('field');
    const imageUrl = canvas.toDataURL("image/jpeg", 0.5);
    await fetchApiData(imageUrl);
  } catch (err) {
    console.error('Error in periodic API call:', err);
  }
}

// 5秒ごとに実行
setInterval(periodicApiCall, 5000);

//webサーバーを作る
const server = http.createServer(async (req, res) => {
  // API endpoint for /api/hello
  if (req.url.startsWith('/api/hello')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const imageUrl = url.searchParams.get('image');
    const apiData = await fetchApiData(imageUrl);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(apiData);
    return;
  }

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

  fs.readFile(filePath, async (error, content) => {
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
      // HTMLファイルの場合、api-responseクラスの内容を置き換え
      if (contentType === 'text/html') {
        const apiData = await fetchApiData();
        let htmlContent = content.toString();
        htmlContent = htmlContent.replace(
          '<div class="api-response">Loading API response...</div>',
          `<div class="api-response">${apiData}</div>`
        );
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(htmlContent, 'utf-8');
      } else {
        // その他のファイルはそのまま返す
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    }
  });
});

// サーバーを指定したポートで起動
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
