
export async function getStatus(client, setStatus) {
    await client.connect();
    let lock = await client.getMailboxLock("INBOX");
    try {
      await client.mailboxOpen("INBOX");
      let status = await client.status('INBOX', { unseen: true, messages: true });
      setStatus(status.messages)
    } finally {
      lock.release();
    }
    await client.logout()
  }
  