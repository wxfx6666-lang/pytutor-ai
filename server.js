const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// 数据库配置
// 密码已更新为用户指定的 '123456'
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456', // 这里修改了密码
    database: process.env.DB_NAME || 'pytutor',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
};

const pool = mysql.createPool(dbConfig);

// 启动时测试连接
pool.getConnection()
    .then(conn => {
        console.log('✅ 成功连接到 MySQL 数据库');
        conn.release();
    })
    .catch(err => {
        console.error('❌ MySQL 连接失败:', err.message);
        console.error('   - 请检查 MySQL 服务是否已启动');
        console.error('   - 请检查数据库 "pytutor" 是否已创建 (运行 schema.sql)');
        console.error('   - 请检查 server.js 中的用户名和密码是否正确');
    });

// --- 路由 ---

// 1. 登录 & 读取数据
app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: '需要用户名' });

    try {
        // 查找或创建用户
        const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        let user = users[0];
        
        if (!user) {
            await pool.execute(
                'INSERT INTO users (username, last_active_module_id, last_active_topic_id) VALUES (?, ?, ?)',
                [username, 'intro', 'syntax']
            );
            user = { username, last_active_module_id: 'intro', last_active_topic_id: 'syntax' };
        }

        // 读取进度
        const [rows] = await pool.execute(
            'SELECT topic_id, code, chat_history, last_modified FROM topic_progress WHERE username = ?',
            [username]
        );

        const progressMap = {};
        rows.forEach(row => {
            let history = [];
            try {
                if (typeof row.chat_history === 'string') {
                    history = JSON.parse(row.chat_history);
                } else if (row.chat_history) {
                    history = row.chat_history;
                }
            } catch (e) {
                console.warn(`解析历史记录失败: ${row.topic_id}, 重置为空。`);
                history = [];
            }

            progressMap[row.topic_id] = {
                topicId: row.topic_id,
                code: row.code || '',
                chatHistory: history,
                lastModified: Number(row.last_modified)
            };
        });

        res.json({
            username: user.username,
            lastActiveModuleId: user.last_active_module_id,
            lastActiveTopicId: user.last_active_topic_id,
            progress: progressMap
        });

    } catch (error) {
        console.error('登录路由错误:', error.message);
        res.status(500).json({ error: error.message, details: '数据库操作失败' });
    }
});

// 2. 保存进度
app.post('/api/save', async (req, res) => {
    const { username, moduleId, topicId, code, chatHistory } = req.body;

    if (!username || !topicId) return res.status(400).json({ error: '缺少必要字段' });

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 更新用户当前位置
        if (moduleId) {
            await connection.execute(
                'UPDATE users SET last_active_module_id = ?, last_active_topic_id = ? WHERE username = ?',
                [moduleId, topicId, username]
            );
        }

        // 保存话题进度
        const historyJson = JSON.stringify(chatHistory || []);
        const timestamp = Date.now();

        const sql = `
            INSERT INTO topic_progress (username, topic_id, code, chat_history, last_modified)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            code = VALUES(code),
            chat_history = VALUES(chat_history),
            last_modified = VALUES(last_modified)
        `;

        await connection.execute(sql, [username, topicId, code, historyJson, timestamp]);

        await connection.commit();
        res.json({ success: true });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('保存路由错误:', error.message);
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});