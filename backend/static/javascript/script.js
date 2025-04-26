window.onload = () => {

    // Djangoから渡されたデータを取得
    const gameDataElement = document.getElementById("gameData");
    let gameData = {};
    
    // データが存在する場合は解析する
    if (gameDataElement) {
        gameData = JSON.parse(gameDataElement.textContent);
        console.log("Djangoから取得したデータ:", gameData.level * 10);
    }

    const max = 12;
    const numbers = [];
    let count = 0;
    for(let i = 0; i < max; i++){
      numbers[i] = i;
    }
    for(let i = 0; i < 30; i++){
      const j = Math.random() * max | 0;
      const k = Math.random() * max | 0;
      if(j == k) continue;
      let temp = numbers[j];
      numbers[j] = numbers[k];
      numbers[k] = temp; 
    }
  
    const screen = document.getElementById("screen");
    for(let i = 0; i < max; i++){
      const elm = document.createElement('div');
      elm.className = "card";
      elm.id = numbers[i];
      elm.addEventListener('pointerdown', function(){
        if(count != this.id)return;
        count++;
        this.style.backgroundColor = "black";  
      }, false);
      screen.appendChild(elm);
      const p = document.createElement('p');
      p.innerText = numbers[i];
      elm.appendChild(p);
    }

    document.addEventListener('DOMContentLoaded', function() {
      // GAME_DATAはすでにHTMLで定義されているため、ここで使用可能
      console.log('ゲームレベル:', GAME_DATA.level);
    });
  }
