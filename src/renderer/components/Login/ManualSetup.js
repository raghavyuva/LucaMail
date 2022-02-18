export const ManualSetup = [
  {
    label: "Security",
    defaultval: "SSL/TLS",
    options: ["SSL/TLS", "NONE"],
  },
  {
    label: "IMAP server",
    defaultval: "imap.gmail.com",
    options: [
      {
        label: "Google",
        host: "imap.gmail.com",
        port: 993,
      },
      {
        label: "Yahoo",
        host: "imap.mail.yahoo.com",
        port: 993,
      },
      {
        label: "Outlook",
        host: "outlook.office365.com",
        port: 993,
      },
      {
        label: "Proton Mail",
        host: "mail.protonmail.com",
        port: 993,
      },
    ],
  },
];
