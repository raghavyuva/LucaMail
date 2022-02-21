import React, { useState, useEffect } from "react";
import {
  MdAlternateEmail,
  MdOutlineDoorFront,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { FiServer } from "react-icons/fi";
import InputField from "~/components/Login/InputField";
import { setAuthenticated } from "~/redux/actions/UserActions";
import { useDispatch } from "react-redux";
import { ManualSetup } from "~/components/Login/ManualSetup";
import SelectField from "~/components/Login/SelectField";
import Button from "~/components/Basic/Button";
import { LogintoAccount } from "~/services";
import { setLoading } from "~/redux/actions/LoadingActions";
import { checkExists, createFolder, WriteFile } from "~/lib/fileAction";
import Loading from "../components/Loading/Loading";
const { ImapFlow } = require("imapflow");
const path = require("path");
const pino = require('pino')();
pino.level = 'silent';
function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Port] = useState(993);
  const [AuthResult, setAuthResult] = useState();
  const [visible, setvisible] = useState(true);
  const [load, setload] = useState(false);
  const [Manual, setManual] = useState(true);
  const [Host, setHost] = useState("");
  const [port, setport] = useState("");
  let client;
  const dispatch = useDispatch();

  const [selected] = useState({
    host: ManualSetup[1].options[0].host,
    secure: true,
    port: Port,
    logger:pino,
    auth: {
      user: email,
      pass: password,
    },
    emitLogs: false,
  });
  useEffect(() => {
    let isMounted = true;
    if (AuthResult == true) {
      if (checkExists("")) {
        if (checkExists("user" || checkExists("conf"))) {
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
    }
    return () => {
      isMounted = false;
    };
  }, [AuthResult]);

  function StoreInfo() {
    // cl = new ImapFlow(selected);
    // getInformation(cl, "INBOX", "conf.txt")
    WriteFile(path.join("user", "user.txt"), selected);
    setTimeout(() => {
      dispatch(setAuthenticated(true));
      setload(false);
    }, 2500);
  }

  const onLoginClick = () => {
    dispatch(setLoading(true));
    if (!email || !password) {
      alert("fields cannot be empty");
      dispatch(setLoading(false));
    } else {
      if (validateEmail) {
        if (Manual) {
          selected.host = Host;
          selected.port = port;
          client = new ImapFlow(selected);
          LogintoAccount(client, setAuthResult);
          dispatch(setLoading(false));
        } else {
          client = new ImapFlow(selected);
          LogintoAccount(client, setAuthResult);
          dispatch(setLoading(false));
        }
      }
    }
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  useEffect(() => {
    let isMounted = true;
    (selected.auth.user = email), (selected.auth.pass = password);
    return () => {
      isMounted = false;
    };
  }, [password, email]);

  if (load) {
    return <Loading />;
  }

  return (
    <div>
      <section className="relative flex flex-wrap lg:h-[calc(100vh_-_2rem)] lg:items-center  justify-center text-primary-text  ">
        <div className="w-max px-2 py-12  sm:px-6 lg:px-4 sm:py-10 lg:py-14 bg-positive shadow-lg rounded-md">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {" "}
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
            {!Manual && <SelectField selected={selected} />}
            {Manual && (
              <div className="grid grid-cols-2 ">
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
              </div>
            )}
            <div className="flex items-center justify-center">
              <Button btntext="Login" handler={onLoginClick} />
            </div>
            <label className="inline-flex items-center space-x-4 cursor-pointer text-primary-text ml-4">
              <span>{Manual ? "Auto" : "Manual"}</span>
              <span className="relative">
                <input
                  id="Toggle2"
                  type="checkbox"
                  className="hidden peer"
                  onChange={() => setManual(!Manual)}
                />
                <div className="w-10 h-4 rounded-full shadow bg-primary peer-checked:bg-primary"></div>
                <div className="absolute left-0 w-6 h-6 rounded-full shadow -inset-y-1 peer-checked:right-0 peer-checked:left-auto bg-primary"></div>
              </span>
            </label>
            {AuthResult != true && (
              <span className="font-extrabold">{AuthResult}</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
