export async function MoveToFolder(client, sourcePath, destpath, uid,) {
    await client.connect();
    await client.mailboxOpen(sourcePath)
    try {
        let result = await client.messageMove(uid, destpath, { uid: true });
        alert(`message moved to ${destpath}`)
    } catch (error) {
        alert(`error moving to ${destpath}`)
    }
    await client.logout();
}