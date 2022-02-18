const { ipcRenderer } = window.require("electron");
const ipc = ipcRenderer;
export const SettingTypes = {
  boolvaled: [
    {
      label: "Drawer Open on startup",
      default: true,
    },
    {
      label: "Hide Support Card on Drawer",
      default: false,
    },
    {
      label: "Store Mails in Local Drive",
      default: true,
    },
    {
      label: "Hide TopBar",
      default: false,
    },
  ],
};
