import {
  BriefcaseBusiness,
  ChartColumnIncreasing,
  ChartNoAxesCombined,
  CircleUser,
  FileChartColumn,
  FileClock,
  Layers,
  LayoutDashboard,
  LayoutDashboardIcon,
  LockKeyholeOpen,
  Mail,
  MailWarning,
  MessageCircleMore,
  ReceiptText,
  Settings,
  TicketsPlane,
  Users,
  Utensils,
} from "lucide-react";

export const registerFormControls = [
  {
    name: "emp_code",
    label: "Employee Code",
    placeholder: "Enter Your Employee Code",
    componentType: "input",
    type: "number",
    required: true,
  },
  {
    name: "username",
    label: "Username",
    placeholder: "Enter Your Username",
    componentType: "input",
    type: "text",
    required: true,
  },
  {
    name: "first_name",
    label: "First Name",
    placeholder: "Enter Your First Name",
    componentType: "input",
    type: "text",
    required: true,
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Enter Your Last Name",
    componentType: "input",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter Your Email",
    componentType: "input",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Your Password",
    componentType: "input",
    type: "password",
    required: true,
  },
];

export const loginFormControls = [
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter Your User Name",
    componentType: "input",
    type: "text",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter Your Password",
    componentType: "input",
    type: "password",
    required: true,
  },
];

export const resetPasswordFormControls = [
  {
    name: "old_password",
    label: "Old Password",
    placeholder: "Enter Your Old Password",
    componentType: "input",
    type: "password",
    required: true,
  },
  {
    name: "new_password",
    label: "New Password",
    placeholder: "Enter Your New Password",
    componentType: "input",
    type: "password",
    required: true,
  },
  {
    name: "confirm_password",
    label: "Confirm Password",
    placeholder: "Confirm New Password",
    componentType: "input",
    type: "password",
    required: true,
  },
];

export const SIDEBAR_MENU = {
  employee: [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "attendance",
      label: "Attendance",
      path: "/attendance",
      icon: FileChartColumn,
    },
    {
      id: "leave",
      label: "Leave",
      path: "/leave",
      icon: TicketsPlane,
      submenu: [
        {
          id: "leave-aplication",
          label: "Leave Application",
          path: "/leave-aplication",
          icon: Mail,
        },
        {
          id: "leave-history",
          label: "Leave History",
          path: "/leave-history",
          icon: FileClock,
        },
      ],
    },
    {
      id: "meal",
      label: "Meal",
      path: "/meal",
      icon: Utensils,
      submenu: [
        {
          id: "weekly-menu",
          label: "Weekly Menu",
          path: "/EmployeeWeeklyMeal",
          icon: Layers,
        },
        {
          id: "meal-opt-out",
          label: "Meal Opt-Out",
          path: "/meal-opt-out", // ✅ match App.jsx
          icon: Users,
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      path: "/setting",
      icon: Settings,
      submenu: [
        {
          id: "profile",
          label: "Profile",
          path: "/setting",
          icon: CircleUser,
        },
        {
          id: "reset-password",
          label: "Reset Password",
          path: "/reset-password",
          icon: LockKeyholeOpen,
        },
      ],
    },
    {
      id: "messages",
      label: "Chat",
      path: "/chat",
      icon: MessageCircleMore,
    },
  ],
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      id: "attendance",
      label: "Attendance",
      path: "/attendance",
      icon: FileChartColumn,
    },
    {
      id: "employees",
      label: "Employees",
      path: "/employees",
      icon: Users,
    },
    {
      id: "reports",
      label: "Reports",
      path: "/reports",
      icon: ReceiptText,
      submenu: [
        {
          id: "overview",
          label: "Overview",
          path: "/overview",
          icon: ChartNoAxesCombined,
        },
        {
          id: "irregularities",
          label: "Irregularities",
          path: "/irregularities",
          icon: ChartColumnIncreasing,
        },
      ],
    },
    {
      id: "leave",
      label: "Leave",
      path: "/leave",
      icon: TicketsPlane,
      submenu: [
        {
          id: "leave-records",
          label: "Leave Records",
          path: "/leave-records",
          icon: Layers,
        },
        {
          id: "leave-application-history",
          label: "Application History",
          path: "/leave-application-history",
          icon: MailWarning,
        },
      ],
    },
    {
      id: "jobs",
      label: "Jobs",
      path: "/jobs",
      icon: BriefcaseBusiness,
      submenu: [
        {
          id: "job-records",
          label: "Job Records",
          path: "/job-records",
          icon: Layers,
        },
        {
          id: "job-application-history",
          label: "Application History",
          path: "/job-application-history",
          icon: MailWarning,
        },
      ],
    },
    {
      id: "meal",
      label: "Meal",
      path: "/meal",
      icon: Utensils, // import this icon at the top
      submenu: [
        {
          id: "weekly-menu",
          label: "Weekly Menu",
          path: "/meal/weekly",
          icon: Layers,
        },
        {
          id: "meal-override",
          label: "Meal Override",
          path: "/meal/override",
          icon: Layers, // or CalendarDays for visual distinction
        },
        {
          id: "meal-report",
          label: "Meal Report",
          path: "/meal/report",
          icon: FileChartColumn, // Or choose any Lucide icon you like
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      path: "/setting",
      icon: Settings,
      submenu: [
        {
          id: "profile",
          label: "Profile",
          path: "/setting",
          icon: CircleUser,
        },
        {
          id: "reset-password",
          label: "Reset Password",
          path: "/reset-password",
          icon: LockKeyholeOpen,
        },
      ],
    },
    // {
    //   id: "messages",
    //   label: "Chat",
    //   path: "/chat",
    //   icon: MessageCircleMore,
    // },
  ],
};
