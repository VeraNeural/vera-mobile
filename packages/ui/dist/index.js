"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Button: () => Button,
  ExampleCard: () => ExampleCard
});
module.exports = __toCommonJS(src_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var Button = ({ variant = "primary", children, ...rest }) => {
  const className = [
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors",
    variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
  ].join(" ");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className, ...rest, children });
};
var ExampleCard = ({ title, description }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "rounded-lg border border-slate-200 bg-white p-4 shadow-sm", children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-base font-semibold text-slate-900", children: title }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2 text-sm text-slate-600", children: description })
] });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  ExampleCard
});
