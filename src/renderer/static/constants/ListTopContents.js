import {
  MdDelete,
  MdAccessTime,
  MdOutlineReport,
  MdArchive,
  MdStar,
  MdArrowBackIos,
  MdArrowForwardIos,
} from "react-icons/md";

export const ListOpenedBar = {
  contents: [
    {
      icon: MdDelete,
      tooltip: "Delete message",
      func: 'delete'
    },
    {
      icon: MdOutlineReport,
      tooltip: "spam",
      func: "spam"
    },
    {
      icon: MdArchive,
      tooltip: "archive",
      func: "archive"
    },
    {
      icon: MdStar,
      tooltip: "star_outline",
      func: 'star'
    },
  ],
  rightcontent: [
    {
      icon: MdArrowBackIos,
      tooltip: "backward",
      func: "backward"
    },
    {
      icon: MdArrowForwardIos,
      tooltip: "forward",
      func: "forward"
    },
  ],
};


