# MERN Todo App

基于 MERN 技术栈（MongoDB + Express + React + Node.js）的待办事项管理应用，支持用户注册登录、任务的增删改查、按状态分类查看，以及忘记密码重置功能。

## 技术架构

| 层级 | 技术选型 | 说明 |
| --- | --- | --- |
| 前端 | React 18 + React Router 6 | 单页应用，使用 useReducer + Context 管理全局状态 |
| UI | Tailwind CSS + MUI | 原子化 CSS + Material 组件库 |
| HTTP | Axios | 统一封装请求实例，支持 Token 鉴权 |
| 后端 | Node.js + Express | RESTful API，ES Modules 模块规范 |
| 数据库 | MongoDB 7.0 + Mongoose | 文档型存储，通过 Mongoose ODM 操作 |
| 鉴权 | JWT + Bcrypt | JSON Web Token 签发与校验，Bcrypt 加密密码 |
| 部署 | Docker | 单容器集成 MongoDB + 后端 + 前端构建产物 |

## 目录结构

```
mern-todo-app-web/
├── backend/                 # 后端服务
│   ├── controllers/         # 业务控制器
│   │   ├── userController.js        # 用户登录/注册/查询
│   │   ├── taskController.js        # 任务增删改查
│   │   └── forgotPasswordController.js  # 忘记密码/重置密码
│   ├── middleware/
│   │   └── requireAuth.js          # JWT 鉴权中间件
│   ├── models/              # Mongoose 数据模型
│   │   ├── userModel.js             # 用户模型
│   │   └── taskModel.js             # 任务模型
│   ├── routes/              # 路由定义
│   │   ├── userRoute.js             # /api/user/*
│   │   ├── taskRoute.js             # /api/task/*
│   │   └── forgotPassword.js        # /api/forgotPassword/*
│   ├── server.js            # 应用入口，启动 HTTP + MongoDB + 初始化管理员
│   └── package.json
├── frontend/                # 前端应用
│   ├── public/              # 静态资源
│   ├── src/
│   │   ├── Axios/axios.js           # Axios 实例封装
│   │   ├── components/              # 页面组件
│   │   │   ├── Header/              # 顶部导航
│   │   │   ├── createTask/          # 创建任务表单
│   │   │   ├── Task/               # 单条任务卡片
│   │   │   ├── forgotPassword/     # 忘记/重置密码
│   │   │   ├── Login.jsx           # 登录页
│   │   │   ├── Register.jsx        # 注册页
│   │   │   ├── Layout.jsx          # 任务区布局
│   │   │   ├── AllTask.jsx         # 全部任务列表
│   │   │   ├── Active.jsx          # 未完成任务列表
│   │   │   ├── Completed.jsx       # 已完成任务列表
│   │   │   ├── CompletedTask.jsx   # 已完成任务卡片
│   │   │   └── TaskIndicator.jsx   # 任务分类导航
│   │   ├── context/                # React Context
│   │   │   ├── TaskContext.js      # 任务上下文
│   │   │   └── TokenContext.js     # Token 与用户上下文
│   │   ├── reducer/                # useReducer 状态管理
│   │   │   ├── taskReducer.js
│   │   │   ├── tokenReducer.js
│   │   │   └── userReducer.js
│   │   ├── App.js                  # 路由与状态初始化
│   │   ├── App.css
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
└── readme.md
```

## 模块说明

### 用户模块

- **注册**：用户输入用户名、邮箱、密码，密码经 Bcrypt 加密后存入数据库，注册成功后自动签发 JWT 并登录。
- **登录**：校验邮箱密码后签发 JWT，Token 持久化到 localStorage，后续请求通过 Authorization Header 携带。
- **忘记密码**：输入邮箱后生成重置 Token，通过邮件发送重置链接（若未配置邮箱凭证则直接返回重置链接）。
- **重置密码**：通过重置 Token 验证身份后设置新密码。

### 任务模块

- **创建任务**：填写标题和描述，保存后关联当前用户 ID，同时触发邮件通知。
- **查看任务**：按当前用户拉取全部任务，支持「全部 / 未完成 / 已完成」三种视图切换。
- **标记完成**：勾选复选框切换任务完成状态，实时同步到数据库。
- **删除任务**：点击删除按钮移除任务，前后端数据同步。

## 接口列表

| 方法 | 路径 | 鉴权 | 功能 |
| --- | --- | --- | --- |
| POST | `/api/user/register` | 否 | 用户注册，返回 user + token |
| POST | `/api/user/login` | 否 | 用户登录，返回 user + token |
| GET | `/api/user/getUser` | 是 | 获取当前登录用户信息 |
| POST | `/api/task/addTask` | 是 | 新增任务，返回创建的 task |
| GET | `/api/task/getTask` | 是 | 获取当前用户全部任务 |
| POST | `/api/task/removeTask` | 是 | 删除指定任务 |
| POST | `/api/task/updateTask` | 是 | 更新任务完成状态 |
| POST | `/api/forgotPassword/forgotPassword` | 否 | 发起密码重置，发送重置链接 |
| POST | `/api/forgotPassword/resetPassword` | 否 | 通过重置 Token 设置新密码 |

## 页面说明

| 页面 | 路由 | 功能 |
| --- | --- | --- |
| 登录 | `/login` | 邮箱密码登录，支持跳转注册和忘记密码 |
| 注册 | `/register` | 新用户注册 |
| 全部任务 | `/` | 展示当前用户所有任务 |
| 未完成 | `/active` | 仅展示未勾选完成的任务 |
| 已完成 | `/completed` | 仅展示已勾选完成的任务 |
| 忘记密码 | `/forgotPassword` | 输入邮箱获取重置链接 |
| 重置密码 | `/resetPassword` | 通过 Token 重置新密码 |

## 启动方式

### 方式一：Docker 一键启动（推荐）

在 `environment` 目录下执行：

```bash
# 构建并启动
docker compose up --build -d

# 查看日志
docker compose logs -f app
```

启动后访问 `http://localhost:8080` 即可使用。

> 若需要使用其他端口，修改 `docker-compose.yml` 中的端口映射 `"8080:5000"` 即可。

容器内已集成 MongoDB，启动时自动初始化管理员账号：

- 邮箱：`admin@todo.com`
- 密码：`admin123`

### 方式二：本地开发模式

1. 启动 MongoDB（本地或 Docker）

2. 启动后端

```bash
cd backend
npm install
npm start
```

后端默认运行在 `http://localhost:8000`，需配置环境变量：

```
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
JWT_SECRET=todo_app_secret_key_2024
PORT=8000
ADMIN_EMAIL=admin@todo.com
ADMIN_PASSWORD=admin123
# 可选：邮件功能
GMAIL_USERNAME=your_gmail@gmail.com
GMAIL_PASSWORD=your_app_password
```

3. 启动前端

```bash
cd frontend
npm install
npm start
```

前端开发服务运行在 `http://localhost:3000`，已配置代理自动转发 `/api` 请求到后端。
