
export async function getQuota(path, client, setquota, setTotalCount) {
    await client.connect();
    let mailbox = await client.mailboxOpen(path);
    let lock = await client.getMailboxLock(path);
    try {
        let quota = await client.getQuota();
        setquota(quota)
    } catch (error) {
    }
    await client.logout();
}
