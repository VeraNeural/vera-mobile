// src/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Button = ({ variant = "primary", children, ...rest }) => {
  const className = [
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
    variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
  ].join(" ");
  return /* @__PURE__ */ jsx("button", { className, ...rest, children });
};
var ExampleCard = ({ title, description }) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-white p-4 shadow-sm", children: [
  /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-slate-900", children: title }),
  /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: description })
] });
export {
  Button,
  ExampleCard
};
