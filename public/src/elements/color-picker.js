// 픽셀 색을 고르는 팔레트
class ColorPicker {

  constructor(id, colors) {
    this.colors = colors;
    this.currentColor = this.colors[0];
    
    this.element = document.getElementById(id);
    this.element.className = 'color-picker'
    
    // colors에 들어 있는 색을 바탕으로 팔레트 생성
    this.colors.forEach((color, idx) => {
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
    
    this.element.style.display = 'flex';
  }

}