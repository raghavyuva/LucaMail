const log = require('electron-log');
const simpleParser = window.require("mailparser").simpleParser;
const Store = require('electron-store');
const store = new Store();


export async function RemoveFlag(connection, uid, flag, path) {
    await connection.connect();
    let mailbox = await connection.mailboxOpen(path);
    let lock = await connection.getMailboxLock(path);
    try {
        await connection.messageFlagsRemove(uid, [flag], { uid: true },)
    } catch (er) {
    } finally {
        lock.release();
    }
    await connection.logout();
}
