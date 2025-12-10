const socket = io();

socket.on('connect', () => {
  console.log('✅ WebSocket connected:', socket.id);
});

socket.on('cell_update', ({ x, y, color, nickname }) => {
  const key = `${x},${y}`;
  const existing = cells.get(key);

  const cell = { x, y, color, nickname };
  cells.set(key, cell);

  if (existing && existing.rect) {
    existing.rect.setStyle({ color, fillColor: color });
    existing.rect.unbindTooltip();
    if (nickname) {
      existing.rect.bindTooltip(nickname, {
        direction: 'top',
        sticky: true,
      });
    }
  } else {
    drawCell(cell);
  }
});