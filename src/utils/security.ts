import crypto from "crypto";

// 存储临时密钥的Map，包含密钥和过期时间
const tempKeys = new Map<string, { key: string; expiresAt: number }>();

// 生成基于用户名和时间的临时密钥
export function generateTempKey(username: string): string {
    const now = Date.now();
    const data = `${username}-${now}-${process.env.ADMIN_PASSWORD}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const expiresAt = now + 10 * 60 * 1000; // 10分钟后过期
    
    tempKeys.set(username, { key: hash, expiresAt });
    
    return hash;
}

// 检查密钥是否有效
export function checkKey(key: string): boolean {
    // 先检查是否是环境变量中的永久密钥
    // if (key === process.env.ADMIN_KEY) {
    //     return true;
    // }
    
    // 检查是否是有效的临时密钥
    const now = Date.now();
    const entries = Array.from(tempKeys.entries());
    for (let i = 0; i < entries.length; i++) {
        const [username, tempKey] = entries[i];
        // 检查密钥是否匹配且未过期
        if (tempKey.key === key && tempKey.expiresAt > now) {
            return true;
        }
        // 清除过期密钥
        if (tempKey.expiresAt <= now) {
            tempKeys.delete(username);
        }
    }
    
    return false;
}

export function checkAdmin(name: string, password: string): boolean { 
    return name === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD;
}