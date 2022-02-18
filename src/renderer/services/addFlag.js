
export async function AddFlag(flag, path, uid, connection) {
    await connection.connect();
    let mailbox = await connection.mailboxOpen(path);
    let lock = await connection.getMailboxLock(path);
    try {
        await connection.messageFlagsAdd(uid, [flag], { uid: true });
        alert(`added flag ${flag}`)
    } catch (er) {
        alert(`error adding flag ${flag}`)
    } finally {
        lock.release();
    }
    await connection.logout();
}
