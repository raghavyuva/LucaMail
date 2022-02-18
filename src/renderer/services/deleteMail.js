export async function DeleteMessage(uid, cx) {
    await cx.connect()
    await cx.mailboxOpen("INBOX");
    let res = await cx.messageDelete(uid, { uid: true });
    await cx.logout();
}
