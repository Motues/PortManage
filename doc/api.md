# API

## 登录（ POST `/api/login`）

**请求体**：
```json
{
  "name": "admin",
  "password": "password"
}
```

**响应**：

如果登录成功，返回一个key
```json
{
  "key": "<KEY>"
}
```

否则返回
```json
{
  "message": "Invalid username or password"
}
```

## 获取服务器信息（ GET `/api/server&key=...`）

**查询参数**：
- `key`（必需）

**响应**：
`GET /api/server&key=...`

```json
{
  "data": [
    {
        "id": "server-1",
        "name": "Web-Prod-01",
        "ip": "192.168.1.10",
        "os": "Ubuntu 22.04 LTS",
        "region": "AWS us-east-1",
        "active": true,
        "ports": [
            {
                "port": 80,
                "service": "HTTP",
                "state": "OPEN",
                "domain": "example.com",
                "info": "Web Server"
            },
            {
                "port": 22,
                "service": "SSH",
                "state": "FILTERED",
                "domain": "ssh.example.com",
                "info": "SSH Server"
            }
        ]
    },
    {
        "id": "server-2",
        "name": "DB-Master",
        "ip": "10.0.0.55",
        "os": "Debian 11",
        "region": "Private Cloud",
        "active": false,
        "ports": [
            {
                "port": 5432,
                "service": "PostgreSQL",
                "state": "OPEN",
                "domain": "db.example.com",
                "info": "Database Server"
            }
        ]
    }
  ]
}
```

如果key不正确，返回401
```json
{
  "message": "Invalid key"
}
```

## 添加服务器信息（ POST `/api/create/server&key=...`）

**查询参数**：
- `key`（必需）

**请求体**：
```json
{
    "id": "server-1",
    "name": "Web-Prod-01",
    "ip": "192.168.1.10",
    "os": "Ubuntu 22.04 LTS",
    "region": "AWS us-east-1",
    "active": true
}
```

**响应**：
如果成功，返回
```json
{
  "message": "Server created"
}
```

否则返回
```json
{
  "message": "Invalid Key"
}
```

## 修改服务器信息（ PUT `/api/update/server&key=...&id=...`）

**查询参数**：
- `key`（必需）
- `id`（必需）

**请求体**：
```json
{
    "id": "server-1",
    "name": "Web-Prod-01",
    "ip": "192.168.1.10",
    "os": "Ubuntu 22.04 LTS",
    "region": "AWS us-east-1",
    "active": true,
}
```

**响应**：

如果成功，返回
```json
{
  "message": "Server updated"
}
```

否则返回
```json
{
  "message": "Invalid Key"
}
```

## 删除服务器信息（ DELETE `/api/delete/server&key=...&id=...`）

**查询参数**：
- `key`（必需）
- `id`（必需）

**响应**：
如果成功，返回
```json
{
    "message": "Server deleted"
}
```
否则返回
```json
{
    "message": "Invalid Key"
}
```







## 添加端口信息（ POST `/api/create/port&key=...&id=...`）

**查询参数**：
- `key`（必需）
- `id`（必需）

**请求体**：
```json
{
    "port": 80,
    "service": "HTTP",
    "state": "OPEN",
    "domain": "example.com",
    "info": "Web Server"
}
```

**响应**：
如果成功，返回
```json
{
    "message": "Port added"
}
```
否则返回
```json
{
    "message": "Invalid Key"
}
```

## 修改端口信息（ PUT `/api/update/port&key=...&id=...&port=...`）

**查询参数**：
- `key`（必需）
- `id`（必需）
- `port`（必需）

**请求体**：
```json
{
    "port": 80,
    "service": "HTTP",
    "state": "OPEN",
    "domain": "example.com",
    "info": "Web Server"
}
```

**响应**：
如果成功，返回
```json
{
    "message": "Port updated"
}
```
否则返回
```json
{
    "message": "Invalid Key"
}
```

## 删除端口信息（ DELETE `/api/delete/port&key=...&id=...&port=...`）
**查询参数**：
- `key`（必需）
- `id`（必需）
- `port`（必需）

**响应**：
如果成功，返回
```json
{
    "message": "Port deleted"
}
```
否则返回
```json
{
    "message": "Invalid Key"
}
```
