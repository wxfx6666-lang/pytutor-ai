import { UserData, TopicProgress, ChatMessage } from './types';
import { CURRICULUM } from './constants';

// ==========================================
// 配置区域
// ==========================================

// 设置为 false 以连接本地 Node.js + MySQL 后端
// 设置为 true (默认) 以使用浏览器缓存模式 (前端模式)
const USE_MOCK_BACKEND = true; 

// Node.js 服务默认端口设置为 3001
const API_BASE_URL = 'http://localhost:3001/api';

// ==========================================
// API 实现
// ==========================================

export const api = {
  /**
   * 用户登录
   */
  login: async (username: string): Promise<UserData> => {
    if (USE_MOCK_BACKEND) {
      console.log(`[MockAPI] Logging in user: ${username}`);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const key = `pytutor_data_${username}`;
      const savedData = localStorage.getItem(key);
      
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (e) {
          console.warn("Corrupted local data found, resetting user data.");
          localStorage.removeItem(key);
          // Fall through to create default data
        }
      }
      
      // 如果没有存档或存档损坏，创建新用户初始数据
      const defaultData: UserData = {
        username,
        lastActiveModuleId: CURRICULUM[0].id,
        lastActiveTopicId: CURRICULUM[0].chapters![0].topics[0].id,
        progress: {}
      };
      return defaultData;
    } else {
      // 连接真实后端
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server Error (${response.status})`);
        }
        
        return await response.json();
      } catch (error: any) {
        console.error("Backend login failed:", error);
        throw new Error(error.message || "Failed to connect to server");
      }
    }
  },

  /**
   * 保存学习进度
   */
  saveProgress: async (
    username: string, 
    activeModuleId: string, 
    activeTopicId: string, 
    code: string, 
    chatHistory: ChatMessage[]
  ): Promise<void> => {
    const currentProgress: TopicProgress = {
        topicId: activeTopicId,
        code: code,
        chatHistory: chatHistory,
        lastModified: Date.now()
    };

    if (USE_MOCK_BACKEND) {
      // 本地存储模式
      const key = `pytutor_data_${username}`;
      const existingDataStr = localStorage.getItem(key);
      let userData: UserData;

      try {
        if (existingDataStr) {
          userData = JSON.parse(existingDataStr);
        } else {
          throw new Error("No data");
        }
      } catch (e) {
        userData = {
          username,
          lastActiveModuleId: activeModuleId,
          lastActiveTopicId: activeTopicId,
          progress: {}
        };
      }

      userData.lastActiveModuleId = activeModuleId;
      userData.lastActiveTopicId = activeTopicId;
      userData.progress[activeTopicId] = currentProgress;

      localStorage.setItem(key, JSON.stringify(userData));
    } else {
      // 真实后端模式
      try {
        const response = await fetch(`${API_BASE_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                moduleId: activeModuleId,
                topicId: activeTopicId,
                code,
                chatHistory
            })
        });
        if (!response.ok) {
           console.error("Save failed:", response.statusText);
        }
      } catch (error) {
          console.error("Failed to save to backend", error);
      }
    }
  }
};