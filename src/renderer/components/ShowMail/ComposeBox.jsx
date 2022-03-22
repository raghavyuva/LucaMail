import { convertToHTML } from "draft-convert";
import { convertToRaw } from "draft-js";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { MdCancel, MdStyle, MdTextFields } from "react-icons/md";
import { RiSendPlaneLine } from "react-icons/ri";
import { Resizable } from "re-resizable";
import { readFile } from "../../lib/fileAction";
const nodemailer = window.require("nodemailer");
const path = require("path");
function ComposeBox({
  editorState,
  setEditorState,
  composeopen,
  setcomposeopen,
  toadress,
  subject,
  action,
  userHome,
}) {
  const [toAddress, settoAdress] = React.useState(toadress);
  const [Subject, setSubject] = React.useState(subject);
  const [body, setbody] = React.useState("");
  const [styledtext, setstyledtext] = useState(false);
  const blocks = convertToRaw(editorState?.getCurrentContent()).blocks;
  const [isDisabled, setisDisabled] = useState(false);
  const value = blocks
    .map((block) => (!block.text.trim() && "\n") || block.text)
    .join("\n");
  const [File, setFile] = useState([]);
  const convertContentToHTML = () => {
    const currentContentAsHTML = convertToHTML(
      editorState?.getCurrentContent()
    );
    setbody(currentContentAsHTML);
  };

  useEffect(() => {
    convertContentToHTML();
  }, [value]);

  const uploadCallback = (file, callback) => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onloadend = async () => {
        let obj = {};
        obj.path = file?.path;
        obj.filename = file?.name;
        setFile((prevData) => [...prevData, obj]);
        resolve({ data: { link: URL.createObjectURL(file) } });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Resizable className=" text-BannerCardText  mt-4 bg-BannerCardBackground overflow-hidden flex flex-col z-50 rounded-lg shadow-lg   ">
      <div>
        <div className="  flex justify-between w-full   rounded-2xl">
          <button
            className="m-2"
            onClick={() => {
              setstyledtext(!styledtext);
            }}
          >
            {!styledtext ? (
              <MdStyle size={25} className=" " />
            ) : (
              <MdTextFields size={25} className=" " />
            )}
          </button>
          <button className="m-2" onClick={() => setcomposeopen(!composeopen)}>
            <MdCancel size={25} className="" />
          </button>
        </div>
      </div>
      <div className="p-2 border-b border-b-SideBarBackground  m-2 mx-2   flex">
        <span className="mr-2 ">To:</span>
        <input
          type="text"
          className=" w-full   bg-BannerCardBackground outline-none "
          value={toAddress}
          onChange={(e) => {
            if (action == "newcompose") {
              settoAdress(e.target.value);
            }
          }}
          placeholder="type to address "
        />
      </div>
      <div className="p-2  mx-2  flex">
        <span className="mr-2 ">Subject:</span>
        <input
          type="text"
          value={Subject}
          onChange={(e) => {
            if (action == "newcompose") {
              setSubject(e.target.value);
            }
          }}
          placeholder="type mail subject here"
          className=" bg-BannerCardBackground  w-full outline-none "
        />
      </div>
      <div className="grow p-2 mx-2 max-h-full grid  rounded-2xl text-text text-opacity-70   ">
        <Editor
          editorState={editorState}
          defaultEditorState={editorState}
          onEditorStateChange={setEditorState}
          toolbarClassName=""
          toolbarHidden={!styledtext}
          toolbar={{
            options: [
              "inline",
              "fontSize",
              "fontFamily",
              "image",
              "list",
              "textAlign",
              "emoji",
              "remove",
              "history",
            ],
            image: {
              previewImage: true,
              uploadEnabled: true,
              urlEnabled: false,
              uploadCallback: uploadCallback,
              defaultSize: {
                height: 100,
                width: 100,
              },
              alignmentEnabled: true,
            },
          }}
          editorClassName="bg-BannerCardBackground text-BannerCardText scroll-smooth   scrollbar-thin  scrollbar-thumb-primary scrollbar-track-windowBarBackground  scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
          wrapperClassName=""
          className="opacity-70 max-w-full  
                max-h-full 
                "
          wrapperStyle={{
            height: 300,
          }}
          placeholder="Type your mail body"
          editorStyle={{
            width: "100%",
          }}
          toolbarCustomButtons={[
            <SendBtn
              handler={() =>
                SendMail(
                  toAddress,
                  Subject,
                  body,
                  File,
                  setFile,
                  userHome,
                  setisDisabled
                )
              }
              isdisabled={isDisabled}
              setisDisabled={setisDisabled}
            />,
          ]}
        />
        {!styledtext && (
          <SendBtn
            handler={() =>
              SendMail(
                toAddress,
                Subject,
                body,
                File,
                setFile,
                userHome,
                setisDisabled
              )
            }
            isdisabled={isDisabled}
            setisDisabled={setisDisabled}
          />
        )}
      </div>
    </Resizable>
  );
}
async function SendMail(
  toAddress,
  subject,
  body,
  fileUri,
  setFile,
  userHome,
  setisDisabled
) {
  setisDisabled(true);
  const conf = JSON.parse(readFile(path.join(userHome, "smtp.txt")))
    ? JSON.parse(readFile(path.join(userHome, "smtp.txt")))
    : null;
  const transporter = nodemailer.createTransport(conf);
  let mailOptions = {
    from: userHome,
    to: toAddress,
    subject: subject,
    text: body,
    html: body,
    attachments: fileUri?.length > 0 ? fileUri : false,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      alert("error sending mail");
      setisDisabled(false);
    } else {
      alert("message sent successfully");
      setFile([]);
      transporter.close();
      setisDisabled(false);
    }
  });
}

export default ComposeBox;

function SendBtn({ handler, isdisabled }) {
  return (
    <div>
      <button
        className="p-2 bg-BannerCardButtonBackground items-center text-BannerCardButtonText self-end flex font-bold px-2 rounded-md shadow-lg m-2 z-50 "
        onClick={handler}
        disabled={isdisabled}
      >
        Send
        <RiSendPlaneLine size={25} className="  text-BannerCardButtonText " />
      </button>
    </div>
  );
}
