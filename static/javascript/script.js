window.onload = () => {
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

    console.log(2);
  }
