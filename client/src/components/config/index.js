export const registerFormControls = [
  {
    name: "name",
    label: "User Name",
    placeholder: "Enter Your User Name",
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
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    componentType: "input",
    type: "password",
    required: true,
  },
];

export const loginFormControls = [
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

export const employeeMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/home",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
  },
];

export const menus = [
  {
    day: "Monday",
    items: ["Parota", "Dal/Vegetable", "Egg"],
    time: "Breakfast (8:30 AM - 9:30 AM)",
  },
  {
    day: "Tuesday",
    items: ["Rice", "Chicken"],
    time: "lunch (11:30 AM - 12:30 PM)",
  },
  {
    day: "Wednesday",
    items: ["Parota", "Dal/Vegetable", "Egg"],
    time: "Breakfast (8:30 AM - 9:30 AM)",
  },
  {
    day: "Thursday",
    items: ["Parota", "Dal/Vegetable", "Egg"],
    time: "Breakfast (8:30 AM - 9:30 AM)",
  },
  {
    day: "Friday",
    items: ["Rice", "Chicken", "Vegetable"],
    time: "lunch (2:00 PM - 2:30 PM)",
  },
]