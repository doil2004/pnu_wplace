const GRID_ZOOM = 18;   // 이 줌 레벨 기준으로 그리드 정의
const CELL_SIZE = 10;   // GRID_ZOOM에서 한 셀의 크기(월드 픽셀 단위)

const PixelGridLayer = L.GridLayer.extend({

  pixelGrid: new Map(),

  options: {
    pane: 'overlayPane',
    tileSize: 200,
    opacity: 1,
    zIndex: 1100,
    showGrid: false
  },

  initialize: function (opts) {
    L.GridLayer.prototype.initialize.call(this, opts);
    this._tileCanvases = new Map(); // 'z/x/y' -> canvas
    this._hoverTooltip = null;
    this._lastHoverCellKey = null;
    this._onMouseMove = this._handleMouseMove.bind(this);
  },

  _tileKey: function (coords) {
    return `${coords.z}/${coords.x}/${coords.y}`;
  },

  // 한 타일 전체를 pixelGrid 기준으로 다시 그리는 함수
  _drawTile: function (coords, tile) {
    const size = this.getTileSize();
    const tileSize = size.x;

    tile.width = tileSize;
    tile.height = tileSize;

    const ctx = tile.getContext('2d');
    ctx.clearRect(0, 0, tileSize, tileSize);

    const scale = Math.pow(2, GRID_ZOOM - coords.z);

    const tileMinXGridPix = coords.x * tileSize * scale;
    const tileMinYGridPix = coords.y * tileSize * scale;
    const tileMaxXGridPix = (coords.x + 1) * tileSize * scale;
    const tileMaxYGridPix = (coords.y + 1) * tileSize * scale;

    const cellXStart = Math.floor(tileMinXGridPix / CELL_SIZE);
    const cellYStart = Math.floor(tileMinYGridPix / CELL_SIZE);
    const cellXEnd = Math.floor((tileMaxXGridPix - 1) / CELL_SIZE);
    const cellYEnd = Math.floor((tileMaxYGridPix - 1) / CELL_SIZE);

    const cellSizeAtCurrentZoom = CELL_SIZE / scale;

    for (let cellX = cellXStart; cellX <= cellXEnd; cellX++) {
      for (let cellY = cellYStart; cellY <= cellYEnd; cellY++) {
        const key = `${cellX},${cellY}`;
        const color = this.pixelGrid.get(key)?.color;
        if (!color) continue;

        const cellOriginGridX = cellX * CELL_SIZE;
        const cellOriginGridY = cellY * CELL_SIZE;

        const cellOriginAtZ_X = cellOriginGridX / scale;
        const cellOriginAtZ_Y = cellOriginGridY / scale;

        const canvasX = cellOriginAtZ_X - coords.x * tileSize;
        const canvasY = cellOriginAtZ_Y - coords.y * tileSize;

        ctx.fillStyle = color;
        ctx.fillRect(
          canvasX,
          canvasY,
          cellSizeAtCurrentZoom,
          cellSizeAtCurrentZoom
        );
      }
    }
  },

  createTile: function (coords) {
    const tile = L.DomUtil.create('canvas', 'leaflet-tile pixel-tile');

    // 이 타일을 캐시에 등록
    const key = this._tileKey(coords);
    this._tileCanvases.set(key, tile);

    // 현재까지의 pixelGrid 기준으로 전체 그리기
    this._drawTile(coords, tile);

    return tile;
  },

  onAdd: function (map) {
    L.GridLayer.prototype.onAdd.call(this, map);

    map.on('mousemove', this._onMouseMove);

    // 타일이 언로드되면 캐시에서도 지우기
    this.on('tileunload', (e) => {
      const key = this._tileKey(e.coords);
      this._tileCanvases.delete(key);
    });
  },

  onRemove: function (map) {
    map.off('mousemove', this._onMouseMove);
    if (this._hoverTooltip && this._hoverTooltip._map) {
      this._map.removeLayer(this._hoverTooltip);
    }
    this._lastHoverCellKey = null;
    L.GridLayer.prototype.onRemove.call(this, map);
  },

  /**
   * 특정 latlng에 픽셀 하나를 칠하고, 화면에 떠 있는 해당 타일만 부분 업데이트
   */
  paintPixelAt: function (latlng, color, nickname) {
    const map = this._map;
    if (!map) return;

    // 1) GRID_ZOOM 기준 셀 좌표 계산 + 데이터 저장
    const pGrid = map.project(latlng, GRID_ZOOM);
    const cellX = Math.floor(pGrid.x / CELL_SIZE);
    const cellY = Math.floor(pGrid.y / CELL_SIZE);
    this.pixelGrid.set(`${cellX},${cellY}`, { color, nickname });

    // 2) 현재 줌/타일 좌표 계산
    const z = map.getZoom();
    const tileSize = this.getTileSize().x;
    const pZ = map.project(latlng, z);
    const tileX = Math.floor(pZ.x / tileSize);
    const tileY = Math.floor(pZ.y / tileSize);

    const tileKey = `${z}/${tileX}/${tileY}`;
    const tile = this._tileCanvases.get(tileKey);
    if (!tile) {
      // 이 타일은 지금 화면에 없으면, 나중에 createTile에서 자동으로 그려짐
      return;
    }

    // 3) 이 타일 캔버스 안에서 그 셀 하나만 그리기
    const ctx = tile.getContext('2d');

    const scale = Math.pow(2, GRID_ZOOM - z);
    const cellSizeAtZ = CELL_SIZE / scale;
    const cellOriginGridX = cellX * CELL_SIZE;
    const cellOriginGridY = cellY * CELL_SIZE;
    const cellOriginAtZ_X = cellOriginGridX / scale;
    const cellOriginAtZ_Y = cellOriginGridY / scale;

    const canvasX = cellOriginAtZ_X - tileX * tileSize;
    const canvasY = cellOriginAtZ_Y - tileY * tileSize;

    ctx.fillStyle = color;
    ctx.fillRect(canvasX, canvasY, cellSizeAtZ, cellSizeAtZ);
  },

  cellToLatLngCenter: function (cellX, cellY) {
    const centerPoint = L.point(
      (cellX + 0.5) * CELL_SIZE,
      (cellY + 0.5) * CELL_SIZE
    );
    return this._map.unproject(centerPoint, GRID_ZOOM);
  },

  latLngToCell: function (latlng) {
    const pGrid = this._map.project(latlng, GRID_ZOOM);
    const cellX = Math.floor(pGrid.x / CELL_SIZE);
    const cellY = Math.floor(pGrid.y / CELL_SIZE);
    return { cellX, cellY };
  },

  getCell: function (cellX, cellY) {
    const key = `${cellX},${cellY}`;
    const cell = this.pixelGrid.get(key);
    return cell;
  },

  _handleMouseMove: function (event) {
    if (!this._map) return;

    const { cellX, cellY } = this.latLngToCell(event.latlng);
    const key = `${cellX},${cellY}`;
    const cell = this.pixelGrid.get(key);

    if (cell && cell.nickname) {
      if (!this._hoverTooltip) {
        this._hoverTooltip = L.tooltip({
          className: 'pixel-tooltip',
          direction: 'top',
          offset: [0, -6],
        });
      }

      if (this._lastHoverCellKey !== key) {
        this._hoverTooltip.setContent(cell.nickname);
        this._lastHoverCellKey = key;
      }
      this._hoverTooltip.setLatLng(event.latlng);

      if (!this._hoverTooltip._map) {
        this._hoverTooltip.addTo(this._map);
      }
      return;
    }

    if (this._hoverTooltip && this._hoverTooltip._map) {
      this._map.removeLayer(this._hoverTooltip);
    }
    this._lastHoverCellKey = null;
  },
});
