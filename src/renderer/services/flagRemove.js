
export async function RemoveFlag(connection, uid, flag, path) {
  await connection.connect();
  await connection.mailboxOpen(path);
  let lock = await connection.getMailboxLock(path);
  let val;
  try {
    val = await connection.messageFlagsRemove(uid, [flag], { uid: true });
  } catch (er) {
  } finally {
    lock.release();
  }
  await connection.logout();
  return val;
}
