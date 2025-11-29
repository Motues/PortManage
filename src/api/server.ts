import type Koa from "koa";
import fs from "fs";
import path from "path";
import { checkKey } from "../utils/security";
import { getQueryString } from "../utils/url";
import LogService from "../utils/log";

// 获取数据库路径
const databasePath = process.env.DATABASE_URL || './data/server.json';
const resolvedDatabasePath = path.resolve(databasePath);

// 读取服务器数据
const readServersData = (): any[] => {
  try {
    const data = fs.readFileSync(resolvedDatabasePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    // 如果文件不存在，则创建新文件并写入 []
    if (error?.code === 'ENOENT') {
      const initialData: any[] = [];
      // 确保目录存在
      const dir = path.dirname(resolvedDatabasePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(resolvedDatabasePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    LogService.error("Failed to read server data", { error });
    return [];
  }
};

// 写入服务器数据
const writeServersData = (data: any[]): void => {
  try {
    // 确保目录存在
    const dir = path.dirname(resolvedDatabasePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(resolvedDatabasePath, JSON.stringify(data, null, 2));
  } catch (error) {
    LogService.error("Failed to write server data", { error });
    throw error;
  }
};

// 获取所有服务器信息
export const getServers = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");

  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const servers = readServersData();
    ctx.body = { data: servers };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error getting servers", { error });
  }
};

// 创建新服务器
export const createServer = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");
  
  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const newServer = ctx.request.body;
    const servers = readServersData();
    
    // 检查是否已存在相同ID的服务器
    const existingServer = servers.find((server: any) => server.id === newServer.id);
    if (existingServer) {
      ctx.status = 400;
      ctx.body = { message: "Server with this ID already exists" };
      return;
    }
    
    servers.push(newServer);
    writeServersData(servers);
    
    ctx.body = { message: "Server created" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error creating server", { error });
  }
};

// 更新服务器信息
export const updateServer = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");
  const id = getQueryString(ctx.query.id, "");
  
  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const updatedServer = ctx.request.body;
    const servers = readServersData();
    
    const serverIndex = servers.findIndex((server: any) => server.id === id);
    if (serverIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Server not found" };
      return;
    }
    
    servers[serverIndex] = updatedServer;
    writeServersData(servers);
    
    ctx.body = { message: "Server updated" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error updating server", { error });
  }
};

// 删除服务器
export const deleteServer = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");
  const id = getQueryString(ctx.query.id, "");
  
  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const servers = readServersData();
    const serverIndex = servers.findIndex((server: any) => server.id === id);
    
    if (serverIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Server not found" };
      return;
    }
    
    servers.splice(serverIndex, 1);
    writeServersData(servers);
    
    ctx.body = { message: "Server deleted" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error deleting server", { error });
  }
};

// 添加端口到服务器
export const createPort = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");
  const serverId = getQueryString(ctx.query.id, "");
  
  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const newPort = ctx.request.body;
    const servers = readServersData();
    
    const serverIndex = servers.findIndex((server: any) => server.id === serverId);
    if (serverIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Server not found" };
      return;
    }
    
    servers[serverIndex].ports = servers[serverIndex].ports || [];
    servers[serverIndex].ports.push(newPort);
    writeServersData(servers);
    
    ctx.body = { message: "Port added" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error adding port", { error });
  }
};

// 更新服务器端口
export const updatePort = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");
  const serverId = getQueryString(ctx.query.id, "");
  const portNumber = getQueryString(ctx.query.port, "");
  
  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const updatedPort = ctx.request.body;
    const servers = readServersData();
    
    const serverIndex = servers.findIndex((server: any) => server.id === serverId);
    if (serverIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Server not found" };
      return;
    }
    
    const portIndex = servers[serverIndex].ports.findIndex((port: any) => port.port == portNumber);
    if (portIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Port not found" };
      return;
    }
    
    servers[serverIndex].ports[portIndex] = updatedPort;
    writeServersData(servers);
    
    ctx.body = { message: "Port updated" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error updating port", { error });
  }
};

// 删除服务器端口
export const deletePort = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
  const key = getQueryString(ctx.query.key, "");
  const serverId = getQueryString(ctx.query.id, "");
  const portNumber = getQueryString(ctx.query.port, "");
  
  if (!checkKey(key)) {
    ctx.status = 401;
    ctx.body = { message: "Invalid key" };
    return;
  }

  try {
    const servers = readServersData();
    
    const serverIndex = servers.findIndex((server: any) => server.id === serverId);
    if (serverIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Server not found" };
      return;
    }
    
    const portIndex = servers[serverIndex].ports.findIndex((port: any) => port.port == portNumber);
    if (portIndex === -1) {
      ctx.status = 404;
      ctx.body = { message: "Port not found" };
      return;
    }
    
    servers[serverIndex].ports.splice(portIndex, 1);
    writeServersData(servers);
    
    ctx.body = { message: "Port deleted" };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    LogService.error("Error deleting port", { error });
  }
};