export async function FetchByLabel(
    client,
    setList,
    mailBoxPath,
    labelName,
    setMessage,
    setwithBody
) {
    await client.connect();
    let lock = await client.getMailboxLock(mailBoxPath);
    try {
        await client.mailboxOpen(mailBoxPath);
        for await (let message of client.fetch("1:*", {
            envelope: true,
            source: true,
            flags: true,
            status: true,
            labels: true,
            uid: true
        })) {
            if (message.labels.size >= 1) {
                message.labels.forEach(logSetElements);
                async function logSetElements(value1, value2, set) {
                    if (value2.toLowerCase().includes(labelName)) {
                        setList((list) => [...list, message.envelope]);
                        let parse = await simpleParser(message.source);
                        setwithBody((Body) => [...Body, parse]);
                        let obj = {};
                        obj.flags = message.flags; obj.envelope = message.envelope;
                        obj.uid = message.uid; obj.labels = message.labels;
                        setMessage((messages) => [...messages, obj]);
                    }
                }
            }
        }
    } finally {
        lock.release();
    }
    await client.logout();
}