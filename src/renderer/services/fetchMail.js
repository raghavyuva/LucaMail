const log = require("electron-log");
const simpleParser = window.require("mailparser").simpleParser;
const Store = require("electron-store");
const store = new Store();
export async function FetchMail(
  setMessages,
  setMailWithBody,
  client,
  fetchLimit,
  fetchedCount,
  withlimit,
  again,
  path
) {
  await client.connect();
  let lock = await client.getMailboxLock(path);
  try {
    await client.mailboxOpen(path);
    let status = await client.status(path, { unseen: true, messages: true });
    let decreasedCount, count, totalCount;
    if (withlimit == true) {
      count = status.messages;
      totalCount = again ? count - fetchedCount : count;
      decreasedCount = again
        ? totalCount - fetchLimit
        : totalCount - fetchLimit;
    } else {
      totalCount = again ? totalCount - fetchedCount : status.messages;
      decreasedCount = again
        ? totalCount - fetchLimit
        : totalCount - fetchLimit > -1
        ? totalCount - fetchLimit
        : 0;
    }
    if (decreasedCount < 0) {
      decreasedCount = 0;
    }
    for await (let message of client.fetch(
      `${decreasedCount + 1}:${totalCount}`,
      {
        envelope: true,
        source: true,
        flags: true,
        status: true,
        labels: true,
        uid: true,
        new: true,
      }
    )) {
      let obj = {};
      obj.flags = message.flags;
      obj.envelope = message.envelope;
      obj.uid = message.uid;
      obj.labels = message.labels;
      setMessages((messages) => [...messages, obj]);
      let parsed = await simpleParser(message.source);
      setMailWithBody((MailWithBody) => [...MailWithBody, parsed]);
    }
  } catch (err) {
  } finally {
    lock.release();
  }
  await client.logout();
}
