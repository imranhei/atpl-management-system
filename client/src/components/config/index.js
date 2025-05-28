import {
  LayoutDashboard,
  FileChartColumn,
  TicketsPlane,
  Settings,
  CircleUser,
  LockKeyholeOpen,
  LayoutDashboardIcon,
  ReceiptText,
  ChartNoAxesCombined,
  ChartColumnIncreasing,
  UserPlus,
  MessagesSquare,
  MessageCircleMore
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
          id: "register",
          label: "Add User",
          path: "/register",
          icon: UserPlus,
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
};