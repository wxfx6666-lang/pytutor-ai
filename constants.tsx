
import React from 'react';
import { BookOpen, Layers, Code } from 'lucide-react';
import { Module } from './types';

export const CURRICULUM: Module[] = [
  {
    id: 'intro',
    title: '第一阶段：Python 基础',
    icon: <BookOpen className="w-4 h-4" />,
    chapters: [
      {
        id: 'c1_basics',
        title: '第一章：核心概念',
        topics: [
          { 
            id: 'syntax', 
            title: '1.1 语法与变量', 
            description: '学习 Python 代码的基本结构和数据存储。', 
            promptTopic: 'Python 基础语法、变量定义、数据类型(int, str, float)、打印输出 (print)',
            category: 'concept',
            difficulty: 'beginner'
          },
          { 
            id: 'io_ops', 
            title: '1.2 输入与输出', 
            description: '与用户进行基本的交互。', 
            promptTopic: 'Python input() 函数获取用户输入, print() 格式化输出 (f-string)',
            category: 'concept',
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'c2_flow',
        title: '第二章：流程控制',
        topics: [
          { 
            id: 'control-flow', 
            title: '2.1 条件判断', 
            description: '掌握 If/Else 逻辑分支。', 
            promptTopic: 'Python 流程控制 (if/elif/else), 逻辑运算符 (and/or/not)',
            category: 'concept',
            difficulty: 'beginner'
          },
          { 
            id: 'loops', 
            title: '2.2 循环结构', 
            description: '使用 For 和 While 重复执行。', 
            promptTopic: 'Python 循环 (for item in list, for i in range, while loops), break/continue',
            category: 'concept',
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'c3_funcs',
        title: '第三章：函数编程',
        topics: [
          { 
            id: 'functions', 
            title: '3.1 函数基础', 
            description: '如何编写可重复使用的代码块。', 
            promptTopic: 'Python 函数定义 (def), 参数传递, return 返回值',
            category: 'concept',
            difficulty: 'beginner'
          },
          { 
            id: 'scope', 
            title: '3.2 作用域', 
            description: '局部变量与全局变量。', 
            promptTopic: 'Python 变量作用域 (Local vs Global), global 关键字',
            category: 'concept',
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'structures',
    title: '第二阶段：数据结构',
    icon: <Layers className="w-4 h-4" />,
    chapters: [
      {
        id: 'c4_sequences',
        title: '第四章：序列类型',
        topics: [
          { 
            id: 'lists', 
            title: '4.1 列表 (Lists)', 
            description: '处理有序的数据序列。', 
            promptTopic: 'Python 列表 (List) 的创建、增删改查(append, remove)、索引切片',
            category: 'concept',
            difficulty: 'beginner'
          },
          { 
            id: 'tuples', 
            title: '4.2 元组 (Tuples)', 
            description: '不可变的数据序列。', 
            promptTopic: 'Python 元组 (Tuple) 的定义与特性, 与列表的区别',
            category: 'concept',
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'c5_mappings',
        title: '第五章：映射与集合',
        topics: [
          { 
            id: 'dicts', 
            title: '5.1 字典 (Dictionaries)', 
            description: '键值对数据存储与查询。', 
            promptTopic: 'Python 字典 (Dictionary) 的键值对操作, get方法, 遍历字典',
            category: 'concept',
            difficulty: 'intermediate'
          },
          { 
            id: 'sets', 
            title: '5.2 集合 (Sets)', 
            description: '无序且不重复的元素集。', 
            promptTopic: 'Python 集合 (Set) 的去重功能, 交集/并集运算',
            category: 'concept',
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'real_world_projects',
    title: '实战项目演练 (20个项目)',
    icon: <Code className="w-4 h-4" />,
    topics: [
      // --- Level 1: Beginner ---
      {
        id: 'p1_hello',
        title: '1. 智能问候机',
        description: '学习 input() 输入和字符串拼接。',
        promptTopic: '项目教学：编写一个程序，询问用户名字和年龄，然后计算出他100岁是哪一年并打印出来。步骤：1.input获取信息 2.int转换类型 3.数学计算 4.print格式化输出。',
        category: 'project',
        difficulty: 'beginner'
      },
      {
        id: 'p2_guess_number',
        title: '2. 猜数字游戏',
        description: '使用 random 模块和循环判断。',
        promptTopic: '项目教学：制作猜数字游戏。步骤：1.导入random生成1-100随机数 2.编写while循环询问用户 3.if/elif判断大小并提示 4.猜对后退出循环。',
        category: 'project',
        difficulty: 'beginner'
      },
      {
        id: 'p3_calc',
        title: '3. 简易计算器',
        description: '基础函数封装与逻辑分支。',
        promptTopic: '项目教学：实现加减乘除计算器。步骤：1.定义四个运算函数(add, sub...) 2.获取用户输入的两个数字和运算符 3.根据运算符调用对应函数输出结果。',
        category: 'project',
        difficulty: 'beginner'
      },
      {
        id: 'p4_unit_converter',
        title: '4. 单位转换器',
        description: '逻辑判断与数学公式应用。',
        promptTopic: '项目教学：公里转英里/摄氏度转华氏度转换器。步骤：1.显示菜单供选择转换类型 2.获取数值 3.应用公式转换 4.输出结果。',
        category: 'project',
        difficulty: 'beginner'
      },
      {
        id: 'p5_rps',
        title: '5. 石头剪刀布',
        description: '列表选择与多重条件判断。',
        promptTopic: '项目教学：人机对战石头剪刀布。步骤：1.定义选项列表["石头","剪刀","布"] 2.电脑随机选择 3.判断胜负逻辑(if/elif) 4.计分系统。',
        category: 'project',
        difficulty: 'beginner'
      },
      {
        id: 'p6_password_gen',
        title: '6. 密码生成器',
        description: '字符串常量与随机抽样。',
        promptTopic: '项目教学：随机强密码生成器。步骤：1.引入string模块获取字母数字符号 2.用户输入密码长度 3.使用random.choice或sample生成随机字符串。',
        category: 'project',
        difficulty: 'beginner'
      },
      {
        id: 'p7_timer',
        title: '7. 专注倒计时',
        description: '时间模块 (time) 与循环控制。',
        promptTopic: '项目教学：番茄钟倒计时。步骤：1.引入time模块 2.输入分钟数 3.while循环每秒打印剩余时间 4.time.sleep(1)延迟 5.结束提示。',
        category: 'project',
        difficulty: 'beginner'
      },
      
      // --- Level 2: Intermediate ---
      {
        id: 'p8_todo_cli',
        title: '8. 命令行待办清单',
        description: '列表的增删查改 (CRUD)。',
        promptTopic: '项目教学：CLI版任务管理器。步骤：1.初始化空列表 2.构建无限循环菜单(添加/查看/删除/退出) 3.实现各分支逻辑 4.处理索引越界错误。',
        category: 'project',
        difficulty: 'intermediate'
      },
      {
        id: 'p9_quiz',
        title: '9. 知识问答游戏',
        description: '字典的使用与计分逻辑。',
        promptTopic: '项目教学：首都知识问答。步骤：1.创建题目字典 {国家: 首都} 2.遍历字典提问 3.比对用户输入(忽略大小写) 4.统计正确率。',
        category: 'project',
        difficulty: 'intermediate'
      },
      {
        id: 'p10_caesar',
        title: '10. 凯撒密码加密',
        description: '字符编码 (ASCII) 与算法逻辑。',
        promptTopic: '项目教学：凯撒位移加密/解密。步骤：1.理解ord()和chr()函数 2.编写encrypt函数接收文本和位移量 3.处理字母循环(z变a) 4.处理非字母字符保持不变。',
        category: 'project',
        difficulty: 'intermediate'
      },
      {
        id: 'p11_hangman',
        title: '11. 猜词游戏 (Hangman)',
        description: '字符串处理与游戏状态管理。',
        promptTopic: '项目教学：Hangman游戏。步骤：1.随机选词 2.显示掩码(如 _ _ a _ _) 3.循环让用户猜字母 4.更新掩码或扣除生命值。',
        category: 'project',
        difficulty: 'intermediate'
      },
      {
        id: 'p12_contact',
        title: '12. 电子通讯录',
        description: '嵌套字典与模拟数据持久化。',
        promptTopic: '项目教学：联系人管理系统。步骤：1.使用字典存储 {姓名: {电话, 邮箱}} 2.实现查找、添加、编辑功能 3.尝试模拟保存到文件(或字符串模拟)。',
        category: 'project',
        difficulty: 'intermediate'
      },
      {
        id: 'p13_frequency',
        title: '13. 词频统计分析',
        description: '文本处理与数据统计。',
        promptTopic: '项目教学：分析一段长文本中单词出现的频率。步骤：1.输入长文本 2.清洗标点并分割成单词列表 3.使用字典或Counter统计词频 4.输出前5高频词。',
        category: 'project',
        difficulty: 'intermediate'
      },
      {
        id: 'p14_scraper',
        title: '14. 模拟网页爬虫',
        description: '模拟 HTML 解析与数据提取。',
        promptTopic: '项目教学：模拟网页数据提取。步骤：1.定义一段模拟HTML字符串 2.使用字符串方法(find, split)提取特定标签内容(如价格、标题) 3.结构化输出数据。',
        category: 'project',
        difficulty: 'intermediate'
      },

      // --- Level 3: Advanced ---
      {
        id: 'p15_tic_tac_toe',
        title: '15. 井字棋 (Tic-Tac-Toe)',
        description: '二维列表与胜利条件检测。',
        promptTopic: '项目教学：双人井字棋。步骤：1.用3x3二维列表表示棋盘 2.编写打印棋盘函数 3.轮流下棋逻辑 4.编写check_winner函数检查行/列/对角线。',
        category: 'project',
        difficulty: 'advanced'
      },
      {
        id: 'p16_text_adventure',
        title: '16. 文字冒险游戏',
        description: '复杂分支逻辑与状态机。',
        promptTopic: '项目教学：迷宫探险游戏。步骤：1.设计房间地图(字典结构) 2.记录玩家当前位置 3.解析指令(go north, take item) 4.物品栏系统。',
        category: 'project',
        difficulty: 'advanced'
      },
      {
        id: 'p17_bank',
        title: '17. 银行账户系统',
        description: '面向对象编程 (OOP) 基础。',
        promptTopic: '项目教学：使用OOP设计银行系统。步骤：1.定义Account类(属性:余额, 方法:存/取/查) 2.处理取款余额不足的情况 3.实例化多个账户进行操作。',
        category: 'project',
        difficulty: 'advanced'
      },
      {
        id: 'p18_library',
        title: '18. 图书管理系统',
        description: '类的继承与对象交互。',
        promptTopic: '项目教学：图书借阅系统。步骤：1.定义Book类 2.定义User类 3.定义Library类管理藏书和借阅记录 4.实现借书/还书逻辑交互。',
        category: 'project',
        difficulty: 'advanced'
      },
      {
        id: 'p19_atm',
        title: '19. ATM 模拟器',
        description: '综合逻辑与错误处理 (Try/Except)。',
        promptTopic: '项目教学：完整ATM流程。步骤：1.验证PIN码 2.主菜单循环 3.异常处理(输入非数字等) 4.余额检查与更新。',
        category: 'project',
        difficulty: 'advanced'
      },
      {
        id: 'p20_blockchain',
        title: '20. 简易区块链',
        description: '哈希算法与链式结构。',
        promptTopic: '项目教学：构建最小区块链。步骤：1.引入hashlib库 2.定义Block类(包含前一区块哈希) 3.实现哈希计算方法 4.创建链并将区块链接起来。',
        category: 'project',
        difficulty: 'advanced'
      }
    ]
  }
];
