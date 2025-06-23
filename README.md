# Secure Task Management System

A comprehensive task management application built with Angular 17, NgRx, NestJS, and Nx. Features role-based access control, real-time task management, and a modern responsive UI.

## 🚀 Tech Stack

- **Frontend**: Angular 17, NgRx, RxJS
- **Backend**: NestJS, TypeScript
- **Build Tool**: Nx
- **Testing**: Jest, Cypress
- **Styling**: CSS with CSS Variables for theming

## 📋 Features

### Core Functionality
- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Search and filter tasks
- ✅ Role-based access control
- ✅ Dark/Light theme toggle
- ✅ Responsive design

### Role-Based Permissions
- **Admin**: Full access to all features
- **Manager**: Can create, edit, and delete tasks
- **User**: Can view and mark tasks as complete
- **Guest**: Read-only access

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx nx serve dashboard
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🎮 How to Use

### Role Switching
1. Use the role switcher in the top-right corner
2. Select your desired role from the dropdown
3. The interface will update based on your permissions

### Task Management
1. **Add Task**: Click "Add Task" button or use the form
2. **Edit Task**: Click the edit icon on any task
3. **Delete Task**: Click the delete icon (Admin/Manager only)
4. **Mark Complete**: Use the checkbox to toggle completion
5. **Search**: Use the search box to filter tasks

### Theme Toggle
- Click the theme toggle button (sun/moon icon) to switch between light and dark modes
- Theme preference is automatically saved

## 🏗️ Project Structure

```
secure-task-manager/
├── apps/
│   ├── dashboard/          # Angular frontend
│   ├── api/               # NestJS backend
│   └── api-e2e/           # Backend e2e tests
├── libs/
│   └── auth/              # Authentication library
└── shared/                # Shared utilities
```

## 🧪 Testing

### Unit Tests
```bash
npx nx test dashboard
```

### E2E Tests
```bash
npx nx e2e dashboard-e2e
```

### Backend Tests
```bash
npx nx test api
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Theming

The app supports both light and dark themes with:
- CSS Variables for consistent theming
- Smooth transitions between themes
- Automatic theme persistence
- System preference detection

## 🔐 Security Features

- Role-based access control
- Input validation
- XSS protection
- Secure routing

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository.
