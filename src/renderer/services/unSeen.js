export async function ListUnseenMails(cl, setunSeenList) {
    await cl.connect();
    let lock = await cl.getMailboxLock("INBOX");
    try {
      await cl.mailboxOpen("INBOX");
      for await (let msg of cl.fetch({ seen: false }, { envelope: true })) {
        setunSeenList((list) => [...list, msg.envelope])
      }
    } finally {
      lock.release();
    }
    await cl.logout()
  }