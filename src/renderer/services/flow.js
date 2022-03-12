import { WriteFile } from "~/lib/fileAction";
const path = require("path");

export async function LogintoAccount(client) {
  let lock;
  try {
    await client.connect();
    lock = await client.getMailboxLock("INBOX");
    if (client.authenticated == true) {
      return true;
    } else {
      console.log('heyyyy')
      return false;
    }
  } catch (error) {
    console.log(error)
    return false;
  }
}

export async function AuthenticateUser(client) {
  await client.connect();
  let lock = await client.getMailboxLock("INBOX");
  if (client.authenticated == true) {
    return true;
  } else {
    return false;
  }
}

export async function setFolders(connection) {
  await connection.connect();
  let tree = await connection.listTree();
}

export async function getInformation(client, Path, writepath) {
  try {
    await client.connect();
    let tree = await client.listTree();
    let obj = {};
    let status;
    obj.folderTree = tree?.folders;
    let lock = await client.getMailboxLock(Path);
    status = await client.status(Path, { unseen: true, messages: true });
    obj.mailStatus = status;
    obj.user = client?.options?.auth?.user;
    let quota = await client.getQuota();
    obj.quota = quota;
    WriteFile(writepath, obj);
    return obj;
  } catch (error) {
    console.log(error)
    return error;
  }
}

export async function SetInfoForFirstTime(
  client,
  Path,
  writepath,
  setInfoData
) {
  try {
    await client.connect();
    let tree = await client.listTree();
    let obj = {};
    let status;
    obj.folderTree = tree?.folders;
    let lock = await client.getMailboxLock(Path);
    status = await client.status(Path, { unseen: true, messages: true });
    obj.mailStatus = status;
    obj.user = client?.options?.auth?.user;
    let quota = await client.getQuota();
    obj.quota = quota;
    setInfoData(obj);
    WriteFile(path.join("conf", writepath), obj);
  } catch (error) {}
}
