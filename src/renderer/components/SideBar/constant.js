import { MdContactMail, MdFolder, MdLogout, MdSettings } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { HiMail, HiTrash } from "react-icons/hi";
import { MdInbox, MdDrafts, MdLabelImportant, MdStar, MdReport } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";

export const ExtendMail = [
  {
    label: "Inbox",
    icon: MdInbox,
    link: "/",
  },
  {
    label: "sent",
    icon: RiSendPlaneFill,
    link: "/sent",
  },
  {
    label: "draft",
    icon: MdDrafts,
    link: "/draft",
  },
  {
    label: "trash",
    icon: HiTrash,
    link: "/trash",
  },
  {
    label: "import",
    icon: MdLabelImportant,
    link: "/important",
  },
  {
    label: "Spam",
    icon: MdReport,
    link: "/spam",
  },
  {
    label: "Star",
    icon: MdStar,
    link: "/starred",
  },
];

export const ExtendContacts = [
  {
    label: "contact",
    icon: HiMail,
    link: "/mail",
  },
  {
    label: "sent",
    icon: HiMail,
    link: "/mail",
  },
  {
    label: "draft",
    icon: HiMail,
    link: "/mail",
  },
  {
    label: "trash",
    icon: HiMail,
    link: "/mail",
  },
];

export const SideBarContents = [
  {
    label: "message",
    icon: HiMail,
    link: ExtendMail,
  },
  {
    label: "message",
    icon: MdContactMail,
    link: ExtendContacts,
  },
  {
    label: "message",
    icon: FaUsers,
    link: "/mail",
  },
  {
    label: "message",
    icon: HiMail,
    link: "/mail",
  },
  {
    label: "New Folder",
    icon: MdFolder,
    link: "/newfolder",
  },

];


export const sidebarBottomContents = [
  {
    label: "Settings",
    icon: MdSettings,
    link: "/settings",
  },
  {
    label: "Logout",
    icon: MdLogout,
    link: "/",
  },
]


export const Supporting = {
  title: "Support us",
  tagline: "Supporting another's success won't ever dampen yours",
  btn: "Donate Now"
}