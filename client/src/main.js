const GRID_ZOOM = 19;   // 이 줌 레벨 기준으로 그리드 정의
const CELL_SIZE = 16;   // GRID_ZOOM에서 한 셀의 크기(월드 픽셀 단위)

const pixelGrid = new Map();

/**
 * 주어진 latlng을 고정 그리드 셀로 변환해서 색을 저장
 */
function setPixelAtLatLng(latlng, color) {
  const p = map.project(latlng, GRID_ZOOM); // GRID_ZOOM에서의 월드 픽셀 좌표
  const cellX = Math.floor(p.x / CELL_SIZE);
  const cellY = Math.floor(p.y / CELL_SIZE);
  const key = `${cellX},${cellY}`;
  pixelGrid.set(key, color);
}

/**
 * 주어진 셀 인덱스에서 latlng을 역으로 얻는 함수
 */
function cellToLatLng(cellX, cellY) {
  const x = (cellX + 0.5) * CELL_SIZE;
  const y = (cellY + 0.5) * CELL_SIZE;
  return map.unproject(L.point(x, y), GRID_ZOOM);
}