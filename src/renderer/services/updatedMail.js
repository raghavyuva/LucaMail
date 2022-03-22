const simpleParser = window.require("mailparser").simpleParser;

export async function OnUpdatedMailFromServer(client, fetchedCount, path) {
  try {
    await client.connect();
    let lock = await client.getMailboxLock(path);
    await client.mailboxOpen(path);
    let status = await client.status(path, { unseen: true, messages: true });
    let total = status.messages;
    let count = 0;
    let latestmailwithenvelope = [];
    let latestMessagesarray = [];
    if (total > fetchedCount) {
      for await (let message of client.fetch(`${fetchedCount + 1}:${total}`, {
        envelope: true,
        source: true,
        flags: true,
        status: true,
        labels: true,
        uid: true,
        new: true,
      })) {
        count += 1;
        let obj = {};
        obj.flags = message.flags;
        obj.envelope = message.envelope;
        obj.uid = message.uid;
        obj.labels = message.labels;
        let parsed = await simpleParser(message.source);
        obj.body = parsed;
        latestMessagesarray.push(obj);
        latestmailwithenvelope.push(message.envelope);
      }
    }
    return { count, latestmailwithenvelope, latestMessagesarray };
  } catch (err) {
    console.log(err);
  }
  await client.logout();
}
