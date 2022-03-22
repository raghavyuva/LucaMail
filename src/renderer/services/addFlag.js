export async function AddFlag(flag, path, uid, connection) {
  await connection.connect();
  await connection.mailboxOpen(path);
  let lock = await connection.getMailboxLock(path);
  let val;
  try {
    val = await connection.messageFlagsAdd(uid, [flag], { uid: true });
    alert(`added flag ${flag}`);
  } catch (er) {
    val = false;
    alert(`error adding flag ${flag}`);
  } finally {
    lock.release();
  }
  await connection.logout();
  return val;
}
