import { WriteFile } from '~/lib/fileAction';
const path = require("path")

export async function LogintoAccount(client, setAuthResult) {
  let lock;
  try {
    await client.connect();
    lock = await client.getMailboxLock("INBOX");
    if (client.authenticated == true) {
      setAuthResult(true);
    }else{
      setAuthResult(false)
    }
  } catch (error) {
    client.on('error', err=>{
  });
    setAuthResult("invalid credentials or configuration")
  }
}

export async function AuthenticateUser(client) {
  await client.connect();
  let lock = await client.getMailboxLock("INBOX");
  if (client.authenticated == true) {
    return true
  } else {
    return false
  }
}


export async function setFolders(connection,) {
  await connection.connect();
  let tree = await connection.listTree();
}

export async function getInformation(client, Path, writepath) {
  try {
    await client.connect();
    let tree = await client.listTree();
    let obj = {}; let status;
    obj.folderTree = tree?.folders;
    let lock = await client.getMailboxLock(Path)
    status = await client.status(Path, { unseen: true, messages: true });
    obj.mailStatus = status
    obj.user = client?.options?.auth?.user
    let quota = await client.getQuota();
    obj.quota = quota
    WriteFile((path.join("conf", writepath)), obj)
  } catch (error) {
  }
}

export async function SetInfoForFirstTime(client, Path, writepath, setInfoData) {
  try {
    await client.connect();
    let tree = await client.listTree();
    let obj = {}; let status;
    obj.folderTree = tree?.folders;
    let lock = await client.getMailboxLock(Path)
    status = await client.status(Path, { unseen: true, messages: true });
    obj.mailStatus = status
    obj.user = client?.options?.auth?.user
    let quota = await client.getQuota();
    obj.quota = quota
    setInfoData(obj);
    WriteFile((path.join("conf", writepath)), obj)
  } catch (error) {
  }
}