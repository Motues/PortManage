import Router from"@koa/router";
import { login, getServers, createServer, updateServer, deleteServer, createPort, updatePort, deletePort } from "../api/index" // admin
import fs from "fs";
import path from "path";


const router = new Router();

router.post("/api/login", login);

// 服务器相关路由
router.get("/api/server", getServers);
router.post("/api/create/server", createServer);
router.put("/api/update/server", updateServer);
router.delete("/api/delete/server", deleteServer);

// 端口相关路由
router.post("/api/create/port", createPort);
router.put("/api/update/port", updatePort);
router.delete("/api/delete/port", deletePort);

router.get("/", async (ctx) => {
  ctx.type = "text/html";
  ctx.body = fs.createReadStream(path.join(__dirname, "../../public/index.html"));
});

export default router;