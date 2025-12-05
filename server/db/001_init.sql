-- users: 로그인 + 닉네임
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- cells: 부산대 지도 상의 픽셀
-- (x, y) 한 칸당 하나, 마지막으로 칠한 사람/색을 저장
CREATE TABLE IF NOT EXISTS cells (
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    color TEXT NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (x, y)
);
