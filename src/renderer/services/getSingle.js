export async function GetSingleMail(client, uid, setsingleMail, path) {
    await client.connect();
    let lock = await client.getMailboxLock(path);
    try {
        let z = await client.fetchOne(uid, {
            uid: true,
            envelope: true,
            flags: true,
            status: true,
            labels: true
            // source: true
        }, { uid: true })
        let obj = {};
        obj.flags = z.flags; obj.envelope = z.envelope; obj.uid = z.uid; obj.labels = z.labels;
        await setsingleMail(obj)
    } finally {
        lock.release();
    }
    await client.logout();
}
