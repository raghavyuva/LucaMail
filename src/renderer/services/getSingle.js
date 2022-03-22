const simpleParser = window.require("mailparser").simpleParser;

export async function GetSingleMail(client, uid, path) {
  await client.connect();
  let lock = await client.getMailboxLock(path);
  try {
    let singlemail;
    let z = await client.fetchOne(
      uid,
      {
        uid: true,
        envelope: true,
        flags: true,
        status: true,
        labels: true,
        source: true
      },
      { uid: true }
    );
    let obj = {};
    obj.flags = z.flags;
    obj.envelope = z.envelope;
    obj.uid = z.uid;
    obj.labels = z.labels;
    let parsed = await simpleParser(z.source);
    obj.body = parsed;
    singlemail = await obj;
    return singlemail;
  } finally {
    lock.release();
  }
}
