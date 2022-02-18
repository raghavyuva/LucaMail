const simpleParser = window.require("mailparser").simpleParser;

export async function OnUpdatedMailFromServer(
  client,
  setUpdatedMailsFromServer,
  setUpdatedMailBody,
  fetchedCount,
  setlatestMailCount,
  Mail,
  Body,
  path
) {
  await client.connect();
  let lock = await client.getMailboxLock(path);
  try {
    await client.mailboxOpen(path);
    let status = await client.status(path, { unseen: true, messages: true });
    let total = status.messages
    let count = 0;
    if (total > fetchedCount) {
      for await (let message of client.fetch(`${fetchedCount + 1}:${total}`, {
        envelope: true,
        source: true,
        flags: true,
        status: true,
        labels: true,
        uid: true,
        new: true
      })) {
        count += 1;
        let obj = {};
        obj.flags = message.flags; obj.envelope = message.envelope; obj.uid = message.uid; obj.labels = message.labels;
        setUpdatedMailsFromServer((messages) => [...messages, obj])
        let parsed = await simpleParser(message.source);
        setUpdatedMailBody((MailWithBody) => [...MailWithBody, parsed])
      }
      setlatestMailCount(count);
    }
  } finally {
    lock.release();
  }
  await client.logout();
}

