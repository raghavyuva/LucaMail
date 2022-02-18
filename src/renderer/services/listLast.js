
export async function listLast(connection) {
  await connection.connect();
  let lock = await connection.getMailboxLock("INBOX");
  await connection.mailboxOpen('INBOX');

  let message = await connection.fetchOne(
    '*',
    {
      uid: true,
      flags: true,
      bodyStructure: true,
      envelope: true,
      internalDate: true,
      size: true,
      headers: ['date', 'subject'],
      source: {
        start: 1024,
        maxLength: 100
      },

      emailId: true,
      threadId: true,
      xGmLabels: true,

      bodyParts: [
        'text',
        '1.mime',
        {
          key: '1',
          start: 2,
          maxLength: 5
        }
      ]
    },
    { uid: false }
  );
  lock.release();
  await connection.logout();
}
