class ColorPicker {

  constructor(id, colors) {
    this.colors = colors;
    this.currentColor = COLORS[0];
    
    this.element = document.getElementById(id);
    
    // span 뒤에 컬러 점들 넣기
    COLORS.forEach((color, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'color-dot';
      dot.style.backgroundColor = color;
    
      if (idx === 0) {
        dot.style.boxShadow = '0 0 0 2px #00000066';
      }
    
      dot.addEventListener('click', () => {
        this.currentColor = color;
    
        // 선택된 색만 테두리 강조
        const allDots = this.element.querySelectorAll('.color-dot');
        allDots.forEach(d => d.style.boxShadow = 'none');
        dot.style.boxShadow = '0 0 0 2px #00000066';
      });
    
      this.element.appendChild(dot);
    });
    
    // 색 선택창 보이게
    this.element.style.display = 'flex';
  }

}