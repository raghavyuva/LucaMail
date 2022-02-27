import React, { useState } from "react";
import {
  MdAlternateEmail,
  MdOutlineDoorFront,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FiServer } from "react-icons/fi";
import InputField from "~/components/Login/InputField";
import { setAuthenticated } from "~/redux/actions/UserActions";
import { useDispatch, connect } from "react-redux";
import { ManualSetup } from "~/components/Login/ManualSetup";
import Button from "~/components/Basic/Button";
import { LogintoAccount } from "~/services";
import { setLoading } from "~/redux/actions/LoadingActions";
import { checkExists, createFolder, WriteFile } from "~/lib/fileAction";
import Loading from "../components/Loading/Loading";
import WindowBar from "../components/TopBar/WindowBar";
const { ImapFlow } = require("imapflow");
const path = require("path");
const pino = require("pino")();
pino.level = "silent";

function Login({ loading }) {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Port] = useState(993);
  const [visible, setvisible] = useState(true);
  const [isSecure] = useState(true);
  const [Host, setHost] = useState("");
  const [Errors, setErrors] = useState("");
  const [port, setport] = useState("993");
  const [smtpHost, setsmtpHost] = useState("");
  const [smtpPort, setsmtpPort] = useState(465);
  const [securesmtp] = useState(true);
  let client;
  const dispatch = useDispatch();

  const [selected] = useState({
    host: ManualSetup[1].options[0].host,
    secure: isSecure,
    port: Port,
    logger: pino,
    auth: {
      user: email,
      pass: password,
    },
  });

  const [smtpconfig] = useState({
    host: smtpHost,
    port: smtpPort,
    auth: {
      user: email,
      pass: password,
    },
    secure: securesmtp,
  });

  const onLoginClick = async () => {
    dispatch(setLoading(true));
    (selected.auth.user = email),
      (selected.auth.pass = password),
      (selected.secure = isSecure),
      (smtpconfig.auth = selected.auth),
      (smtpconfig.secure = securesmtp);
    if (!email || !password || !Host || !port || !smtpHost || !smtpPort) {
      setErrors("input fields cannot be empty");
      dispatch(setLoading(false));
    } else {
      if (validateEmail(email)) {
        selected.host = Host;
        selected.port = port;
        selected.secure = isSecure;
        try {
          client = new ImapFlow(selected);
          let result = await LogintoAccount(client);
          if (result == true) {
            if (checkExists("")) {
              if (checkExists("user")) {
                StoreInfo();
              } else {
                createFolder("user");
                createFolder("conf");
                StoreInfo();
              }
            } else {
              createFolder("");
              createFolder("user");
              createFolder("conf");
              StoreInfo();
            }
          } else {
            setErrors("invalid credentials or configuration of your mail");
            dispatch(setLoading(false));
          }
        } catch (error) {
          console.log(error);
          setErrors("something went wrong while logging in");
          dispatch(setLoading(false));
        }
      } else {
        setErrors("Email is not properly structured");
        dispatch(setLoading(false));
      }
    }
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function StoreInfo() {
    WriteFile(path.join("user", "user.txt"), selected);
    let smtpobj = selected;
    smtpobj.port = smtpPort;
    smtpobj.host = smtpHost;
    delete smtpobj["logger"];
    smtpobj.secure = securesmtp;
    WriteFile(path.join("user", "smtp.txt"), smtpobj);
    dispatch(setAuthenticated(true));
    dispatch(setLoading(false));
  }

  if (loading) {
    return <Loading icon={false} />;
  }

  return (
    <div>
      <WindowBar icon={false} />
      <section
        className="relative flex flex-wrap lg:h-[calc(100vh_-_2rem)] lg:items-center 
        
      justify-center text-primary-text bg-[url('https://images.pexels.com/photos/696680/pexels-photo-696680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover "
      >
        <div className="w-max px-2 py-12  sm:px-6 lg:px-4 sm:py-10 lg:py-14 bg-positive shadow-lg rounded-md">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Incoming Server Settings
            </h1>
            <p className="mt-4 ">
              configure your imap settings to get the mails into your box
            </p>
          </div>
          <div className="max-w-xl mx-auto mt-8  mb-0 space-y-4 ">
            <div className="grid grid-cols-2 ">
              <InputField
                label="Email"
                placeholder="Enter Email"
                Icon={MdAlternateEmail}
                value={email}
                updatedValue={setemail}
              />
              <InputField
                label="password"
                placeholder="Enter Password"
                Icon={visible ? MdVisibility : MdVisibilityOff}
                value={password}
                updatedValue={setpassword}
                visible={visible}
                setvisible={setvisible}
              />
            </div>
            <div className="grid grid-cols-2  ">
              <InputField
                label="host"
                placeholder="Enter Imap Host"
                Icon={FiServer}
                value={Host}
                updatedValue={setHost}
              />
              <InputField
                label="port"
                placeholder="Enter Imap Port"
                Icon={MdOutlineDoorFront}
                value={port}
                updatedValue={setport}
              />
              <InputField
                label="port"
                placeholder="Enter Smtp Host"
                Icon={FiServer}
                value={smtpHost}
                updatedValue={setsmtpHost}
              />
              <InputField
                label="port"
                placeholder="Enter Smtp Port"
                Icon={MdOutlineDoorFront}
                value={smtpPort}
                updatedValue={setsmtpPort}
              />
            </div>
            <div className="flex items-center justify-center ">
              <Button btntext="Login" handler={onLoginClick} />
            </div>
            {Errors && (
              <span className="font-extrabold text-primary-text mt-4 text-center align-middle ">
                {Errors}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loading: state.loadingDetails.loading,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
