// Leaflet을 이용하여 지도에 그리드 표시
const DebugGridLayer = L.GridLayer.extend({
  options: {
    pane: 'overlayPane',
    tileSize: 200,
    opacity: 0.2,
    zIndex: 1000
  },

  // Leaflet 내부에서 호출되는 메서드
  createTile: function (coords) {

    const tile = L.DomUtil.create('canvas', 'leaflet-tile debug-tile');

    const size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;

    const ctx = tile.getContext('2d');

    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, size.x, size.y);

    const step = 4;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    for (let x = 0; x <= size.x; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, size.y);
      ctx.stroke();
    }
    for (let y = 0; y <= size.y; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(size.x, y + 0.5);
      ctx.stroke();
    }

    ctx.fillStyle = 'black';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const label = `z:${coords.z}\nx:${coords.x}\ny:${coords.y}`;
    const lines = label.split('\n');
    const centerX = size.x / 2;
    const centerY = size.y / 2;
    const lineHeight = 18;

    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        centerX,
        centerY + (i - (lines.length - 1) / 2) * lineHeight
      );
    });

    return tile;
  }
});