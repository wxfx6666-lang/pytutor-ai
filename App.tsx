import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CURRICULUM } from './constants';
import { LessonTopic, ChatMessage, UserData, TopicProgress, Module } from './types';
import { api } from './api';
import { 
  Send, 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronDown,
  Code2, 
  Terminal as TerminalIcon,
  Sparkles,
  BookOpen,
  LogOut,
  User,
  Save,
  CheckCircle2,
  Check,
  PanelLeft,
  Folder,
  FileText,
  Trash2,
  Zap,
  Layout,
  Cpu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// 初始化 Gemini API 客户端
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: apiKey || '' });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI client", e);
}

// --- 辅助函数：查找 Topic ---
const findTopicById = (moduleId: string, topicId: string): LessonTopic | undefined => {
  const module = CURRICULUM.find(m => m.id === moduleId);
  if (!module) return undefined;

  // Case 1: Flat topics (e.g. Projects)
  if (module.topics) {
    return module.topics.find(t => t.id === topicId);
  }

  // Case 2: Nested chapters (e.g. Basics)
  if (module.chapters) {
    for (const chapter of module.chapters) {
      const topic = chapter.topics.find(t => t.id === topicId);
      if (topic) return topic;
    }
  }

  return undefined;
};

// --- 登录组件 ---
const LoginScreen = ({ onLogin, isLoading }: { onLogin: (username: string) => void, isLoading: boolean }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    onLogin(username.trim());
  };

  const handleReset = () => {
    if (confirm('确定要清除浏览器本地的所有学习记录吗？此操作无法撤销。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-2xl relative z-10 animate-slide-up border border-white/10">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-brand-500/20">
            <Cpu className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">PyTutor AI</h2>
            <p className="text-slate-400 font-light">您的智能 Python 学习助手</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">用户名</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-3.5 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-600"
                placeholder="请输入您的名字"
                disabled={isLoading}
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-brand-900/50 hover:shadow-brand-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    加载数据中...
                </span>
            ) : (
                <>
                开始学习之旅
                <ChevronRight size={18} />
                </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
            <button 
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1.5 transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
                <Trash2 size={12} className="group-hover:text-red-400" />
                重置数据
            </button>
        </div>
      </div>
    </div>
  );
};

// --- 主应用组件 ---
const App = () => {
  const [user, setUser] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const userDataRef = useRef<UserData | null>(null);
  
  const defaultTopic = CURRICULUM[0].chapters![0].topics[0];
  const [activeModuleId, setActiveModuleId] = useState<string>(CURRICULUM[0].id);
  const [activeTopic, setActiveTopic] = useState<LessonTopic>(defaultTopic);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('等待运行...');
  
  const [expandedModules, setExpandedModules] = useState<string[]>([CURRICULUM[0].id]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>(['c1_basics']);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  useEffect(() => {
    const savedUser = localStorage.getItem('pytutor_current_user');
    if (savedUser) {
      handleLogin(savedUser);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  useEffect(() => {
    if (outputContainerRef.current) {
        outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [output]);

  const handleLogin = async (username: string) => {
    setIsLoginLoading(true);
    try {
      const data = await api.login(username);
      setUser(data.username);
      setUserData(data);
      localStorage.setItem('pytutor_current_user', username);

      if (data.lastActiveModuleId && data.lastActiveTopicId) {
        const topic = findTopicById(data.lastActiveModuleId, data.lastActiveTopicId);
        if (topic) {
          setActiveModuleId(data.lastActiveModuleId);
          setActiveTopic(topic);
          setExpandedModules(prev => prev.includes(data.lastActiveModuleId) ? prev : [...prev, data.lastActiveModuleId]);
          
          const module = CURRICULUM.find(m => m.id === data.lastActiveModuleId);
          if (module?.chapters) {
             const chapter = module.chapters.find(c => c.topics.some(t => t.id === topic.id));
             if (chapter) {
                 setExpandedChapters(prev => prev.includes(chapter.id) ? prev : [...prev, chapter.id]);
             }
          }

          const progress = data.progress[topic.id];
          if (progress) {
              setCode(progress.code);
              setChatHistory(progress.chatHistory);
          } else {
              setCode(`# ${topic.title}\n# 在这里开始编写你的代码...\n`);
              setChatHistory([]);
              setTimeout(() => startAiGreeting(topic), 500);
          }
        }
      } else {
        setTimeout(() => startAiGreeting(defaultTopic), 500);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      localStorage.removeItem('pytutor_current_user');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('pytutor_current_user');
  };

  const performSave = async (specificCode?: string, specificHistory?: ChatMessage[], specificTopicId?: string) => {
    if (!user || !userDataRef.current) return;
    const codeToSave = specificCode !== undefined ? specificCode : code;
    const historyToSave = specificHistory !== undefined ? specificHistory : chatHistory;
    const topicIdToSave = specificTopicId || activeTopic.id;

    setIsSaving(true);
    
    try {
      const newProgress: TopicProgress = {
          topicId: topicIdToSave,
          code: codeToSave,
          chatHistory: historyToSave,
          lastModified: Date.now()
      };

      const newUserData = {
          ...userDataRef.current,
          lastActiveModuleId: activeModuleId,
          lastActiveTopicId: activeTopic.id,
          progress: {
              ...userDataRef.current.progress,
              [topicIdToSave]: newProgress
          }
      };
      
      setUserData(newUserData);
      userDataRef.current = newUserData;
      await api.saveProgress(user, activeModuleId, topicIdToSave, codeToSave, historyToSave);
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const switchTopic = async (topic: LessonTopic, moduleId: string) => {
    if (activeTopic.id === topic.id) return;
    await performSave(code, chatHistory, activeTopic.id);

    setActiveModuleId(moduleId);
    setActiveTopic(topic);
    setOutput('等待运行...');

    const savedProgress = userDataRef.current?.progress[topic.id];
    if (savedProgress) {
        setCode(savedProgress.code);
        setChatHistory(savedProgress.chatHistory);
    } else {
        setCode(`# ${topic.title}\n# 请根据左侧 AI 导师的指引完成项目...\n`);
        setChatHistory([]);
        setTimeout(() => startAiGreeting(topic), 100);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId) 
        : [...prev, chapterId]
    );
  };

  const startAiGreeting = async (topic: LessonTopic) => {
    setIsLoading(true);
    try {
      let systemPrompt = "";
      if (topic.category === 'project') {
          systemPrompt = `你是一位经验丰富的 Python 项目导师。当前项目是：${topic.title}。难度级别：${topic.difficulty}。你的目标是指导用户分步骤完成这个项目。请先用中文简单介绍项目，并说明第一步需要做什么。${topic.promptTopic}`;
      } else {
          systemPrompt = `你是一位友好的 Python 老师。当前课程是：${topic.title}。请用简洁的中文介绍这个概念，并给出一个简单的代码示例。${topic.promptTopic}`;
      }

      if (!ai) throw new Error("AI client not initialized");
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: systemPrompt }] }], 
      });

      const text = response.text;
      if (text) {
        setChatHistory([{
            id: Date.now().toString(),
            role: 'model',
            text: text,
            timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error("AI Greeting Error:", error);
      setChatHistory([{
          id: 'error',
          role: 'model',
          text: "你好！AI 导师目前连接有点不顺畅，请检查右上角的 API Key 状态，或者直接在右侧开始写代码吧。",
          timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMessage,
      timestamp: Date.now()
    };

    const newHistory = [...chatHistory, newUserMsg];
    setChatHistory(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyText = newHistory.map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.text}`).join('\n');
      const prompt = `
      Current Topic: ${activeTopic.title}
      Current User Code:\n\`\`\`python\n${code}\n\`\`\`
      Chat History:\n${historyText}
      User: ${newUserMsg.text}
      请用中文回答。如果用户在做项目，检查代码进度并给出指引。如果代码有错误，请温柔地指出。
      `;

      if (!ai) throw new Error("AI client not initialized");
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
      });

      const text = response.text;
      if (text) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: text,
          timestamp: Date.now()
        };
        const updatedHistory = [...newHistory, aiMsg];
        setChatHistory(updatedHistory);
        performSave(code, updatedHistory); 
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: "网络连接出现问题，请稍后再试。",
          timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 代码运行函数 ---
  // 负责将编辑器中的 Python 代码发送给 AI 进行模拟运行
  // 核心流程：构建提示词 -> 调用 Gemini 流式接口 -> 实时更新终端输出
  const runCode = async () => {
    if (!code.trim()) return; // 如果代码为空，不执行
    setIsRunning(true);       // 设置运行状态，禁用“运行”按钮
    setOutput('');            // 清空上一次的终端输出

    // 1. 构建 Prompt (提示词)
    // 这里的关键是告诉 AI 扮演 Python 解释器。
    // 我们要求 AI：
    // - 执行代码
    // - 模拟 input() 的用户输入（因为是静态环境，AI 需要自己假设输入值，或我们可以做更复杂的交互）
    // - 如果报错，不仅要显示 Traceback，还要用中文解释错误原因并给出修正代码
    const prompt = `
Act as a Python interpreter. Execute the following code and show the output.
If the code takes user input (input() function), simulate a typical input for the context.
If there is an error, show the traceback, then print a separator line "--------------------------------------------------",
then explain the error in Chinese (under the heading "错误分析"), and provide the corrected code (under the heading "修正代码").
Do not output anything else (like "Here is the output") except the code execution result.

Code to execute:
${code}
    `;

    try {
      if (!ai) throw new Error("AI client not initialized");
      
      // 2. 调用 Gemini 流式接口 (generateContentStream)
      // 使用流式输出可以让用户像看真实终端一样，看着文字一个个蹦出来，体验更好，
      // 而不是等几秒钟然后一次性显示所有结果。
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
      });

      // 3. 处理流式响应
      // 这里的 for await 循环会随着 AI 每生成一小段文本就执行一次
      for await (const chunk of responseStream) {
        const text = chunk.text; // 获取当前块的文本
        if (text) {
          // 将新收到的文本追加到 output 状态中
          // React 的 setState 会触发重新渲染，让终端即时显示新内容
          setOutput(prev => prev + text);
        }
      }

    } catch (error: any) {
      console.error("Code Execution Error:", error);
      // 如果 API 调用失败（如网络中断、Key失效），显示友好的错误提示
      setOutput(prev => prev + `\n\n[系统提示] 代码执行服务暂时不可用 (API Error)。\n请检查 API Key 或网络连接。\n错误详情: ${error.message}`);
    } finally {
      setIsRunning(false); // 无论成功失败，最后都恢复“运行”按钮状态
      performSave();       // 自动保存当前代码，防止丢失
    }
  };

  const renderTopicItem = (topic: LessonTopic, moduleId: string, depth: number = 0) => {
    const isActive = activeTopic.id === topic.id;
    const hasLearned = (userData?.progress[topic.id]?.code?.length || 0) > 10;
    
    return (
      <button
        key={topic.id}
        onClick={() => switchTopic(topic, moduleId)}
        className={`w-full text-left relative flex items-center justify-between group transition-all duration-200
          ${depth === 0 ? 'pl-9 pr-3 py-2.5 text-sm' : 'pl-4 pr-3 py-2 text-xs'}
          ${isActive 
            ? 'bg-brand-500/10 text-brand-400' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
        `}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>}
        
        <span className="truncate flex items-center gap-2">
            <FileText size={depth === 0 ? 14 : 12} className={isActive ? 'text-brand-500' : 'text-slate-600 group-hover:text-slate-400 transition-colors'}/>
            {topic.title}
        </span>
        {hasLearned && (
          <Check size={12} className="text-emerald-500 ml-2 flex-shrink-0" />
        )}
      </button>
    );
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} isLoading={isLoginLoading} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* 侧边栏 */}
      <div className={`${isSidebarOpen ? 'w-72' : 'w-0'} overflow-hidden transition-all duration-300 glass-sidebar border-r border-white/5 flex flex-col relative z-20`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-slate-900/50 to-transparent">
          <div className="flex items-center gap-2.5 font-bold text-white tracking-tight">
            <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-1.5 rounded-lg shadow-lg shadow-brand-500/20">
                <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className={`text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 truncate`}>PyTutor AI</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3 custom-scrollbar">
          {CURRICULUM.map((module) => {
            const isModuleExpanded = expandedModules.includes(module.id);
            return (
              <div key={module.id} className="rounded-xl overflow-hidden bg-slate-900/40 border border-white/5">
                {/* 一级菜单: 模块 */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`w-full flex items-center justify-between p-3 text-sm font-semibold transition-all ${
                    activeModuleId === module.id 
                        ? 'bg-slate-800/80 text-white shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={activeModuleId === module.id ? 'text-brand-400 drop-shadow-md' : 'text-slate-500'}>{module.icon}</span>
                    <span className="truncate">{module.title}</span>
                  </div>
                  {isModuleExpanded ? <ChevronDown size={14} className="opacity-70 flex-shrink-0" /> : <ChevronRight size={14} className="opacity-50 flex-shrink-0" />}
                </button>

                {isModuleExpanded && (
                  <div className="bg-black/20 py-1 border-t border-white/5">
                    {/* 情况 A: 模块下直接有 Topics */}
                    {module.topics && module.topics.map((topic) => renderTopicItem(topic, module.id))}
                    
                    {/* 情况 B: 模块下有 Chapters */}
                    {module.chapters && module.chapters.map((chapter) => {
                        const isChapterExpanded = expandedChapters.includes(chapter.id);
                        return (
                            <div key={chapter.id} className="relative">
                                {/* 连接线 */}
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5"></div>

                                {/* 二级菜单: 章节 */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full flex items-center justify-between pl-8 pr-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
                                >
                                    <div className="flex items-center gap-2">
                                        <Folder size={12} className={isChapterExpanded ? "text-brand-400" : "text-slate-600"} />
                                        <span className="truncate">{chapter.title}</span>
                                    </div>
                                    {isChapterExpanded ? <ChevronDown size={12} className="flex-shrink-0" /> : <ChevronRight size={12} className="flex-shrink-0" />}
                                </button>
                                
                                {/* 三级菜单: 课程 */}
                                {isChapterExpanded && (
                                    <div className="pl-6 ml-2 border-l border-white/10 my-1 space-y-0.5">
                                        {chapter.topics.map(topic => renderTopicItem(topic, module.id, 1))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-brand-500/20 flex-shrink-0">
                {user.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                  <span className="text-slate-200 font-medium truncate">{user}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      在线
                  </span>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors flex-shrink-0" title="退出登录">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-950/80 relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>

        {/* 顶部栏 */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass-panel z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="text-slate-400 hover:text-white transition-colors"
                title={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
            >
              <PanelLeft size={20} />
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <h1 className="font-semibold text-white truncate flex items-center gap-3">
              {activeTopic.category === 'project' && (
                <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 px-2 py-1 rounded-md border border-amber-500/20 flex items-center gap-1 flex-shrink-0">
                    <Zap size={10} fill="currentColor"/>
                    项目
                </span>
              )}
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent truncate">
                  {activeTopic.title}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={() => performSave()} 
                disabled={isSaving}
                className={`text-xs flex items-center gap-2 px-4 py-2 rounded-lg transition-all border
                  ${isSaving 
                    ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' 
                    : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white'}
                `}
            >
              <Save size={14} className={isSaving ? 'animate-pulse' : ''} />
              {isSaving ? '保存中...' : '保存进度'}
            </button>
          </div>
        </header>

        {/* 内容分屏 */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* 左侧：AI 导师聊天区 */}
          <div className="w-1/3 min-w-[350px] border-r border-white/5 flex flex-col bg-slate-900/30 backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {chatHistory.length === 0 && !isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in">
                  <div className="relative mb-6">
                      <div className="absolute inset-0 bg-brand-400 blur-2xl opacity-20 rounded-full"></div>
                      <Sparkles className="w-16 h-16 text-brand-300 relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">准备好了吗？</h3>
                  <p className="text-slate-400 max-w-xs mb-8">AI 导师已经准备好为你讲解课程内容并指导实战项目。</p>
                  <button 
                    onClick={() => startAiGreeting(activeTopic)}
                    className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl transition-all shadow-lg shadow-brand-500/25 transform hover:scale-105"
                  >
                    <Play size={16} fill="currentColor" />
                    开始本节课
                  </button>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-500 mb-1 ml-1">{msg.role === 'user' ? '你' : 'AI 导师'}</span>
                        <div 
                        className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                            msg.role === 'user' 
                            ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white rounded-br-none border border-white/10' 
                            : 'bg-slate-800/80 text-slate-100 rounded-bl-none border border-white/5'
                        }`}
                        >
                        <ReactMarkdown 
                            components={{
                                code: ({node, ...props}) => <code className="bg-black/30 rounded px-1 py-0.5 text-brand-200 font-mono text-xs" {...props} />,
                                pre: ({node, ...props}) => <pre className="bg-black/30 rounded-lg p-3 my-2 overflow-x-auto text-xs" {...props} />
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                        </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-slate-800/50 rounded-2xl rounded-bl-none px-4 py-3 border border-white/5 flex items-center gap-2">
                    <span className="text-xs text-slate-400 mr-2">思考中...</span>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-5 border-t border-white/5 bg-slate-900/60 backdrop-blur-md z-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={activeTopic.category === 'project' ? "询问项目下一步怎么做..." : "输入问题..."}
                  className="w-full bg-slate-950/80 border border-slate-700/50 rounded-xl pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-slate-600 text-slate-200 relative z-10 shadow-inner"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-500 hover:text-brand-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-20 hover:bg-brand-500/10 rounded-lg"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：代码编辑器与终端 */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
            
            {/* 代码编辑区 */}
            <div className="flex-1 flex flex-col min-h-0 relative z-10">
              <div className="h-10 bg-[#0b1121] border-b border-white/5 flex items-center px-4 justify-between select-none">
                <div className="flex items-center gap-0.5">
                    <div className="px-4 py-2 bg-slate-900 border-t-2 border-brand-500 text-slate-200 text-xs rounded-t-lg flex items-center gap-2 shadow-sm">
                        <Code2 size={12} className="text-brand-400" />
                        main.py
                    </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500"></span>
                    Python 3.10
                </div>
              </div>
              <div className="flex-1 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0b1121]/50 border-r border-white/5 flex flex-col items-center pt-4 gap-1 select-none pointer-events-none z-10 text-[10px] text-slate-700 font-mono">
                      {Array.from({length: 20}).map((_, i) => <div key={i}>{i+1}</div>)}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-[#020617] pl-16 pr-4 py-4 font-mono text-sm leading-6 resize-none focus:outline-none text-slate-300 selection:bg-brand-500/20"
                    spellCheck={false}
                  />
              </div>
            </div>

            {/* 终端输出区 */}
            <div className="h-2/5 min-h-[200px] border-t border-white/10 flex flex-col bg-[#050a15] shadow-[0_-5px_20px_rgba(0,0,0,0.3)] z-20">
              <div className="h-10 bg-[#0b1121] border-b border-white/5 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <TerminalIcon size={14} className="text-purple-400" />
                  <span>终端控制台</span>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setOutput('等待运行...')}
                        className="p-1.5 hover:bg-white/10 rounded-md text-slate-500 hover:text-white transition-colors"
                        title="清空终端"
                    >
                        <RotateCcw size={14} />
                    </button>
                    <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center gap-2 text-xs px-4 py-1.5 rounded-md font-medium transition-all shadow-lg
                        ${isRunning 
                            ? 'bg-slate-700 text-slate-400 cursor-wait' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40'}
                    `}
                    >
                    {isRunning ? (
                        <>运行中...</>
                    ) : (
                        <>
                        <Play size={12} fill="currentColor" />
                        运行代码
                        </>
                    )}
                    </button>
                </div>
              </div>
              <div 
                ref={outputContainerRef}
                className="flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap text-slate-300 custom-scrollbar relative"
              >
                {/* 终端扫描线效果 */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
                
                <div className="relative z-10">
                    {output.startsWith('Traceback') ? (
                        <span className="text-red-400">{output}</span>
                    ) : (
                        output
                    )}
                    {isRunning && <span className="animate-pulse inline-block w-2.5 h-5 bg-emerald-500 ml-1 align-middle shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;