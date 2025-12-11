
const session = { title: "Test", date: "2025-01-01", time: "20:00", location: "Bar" };
const pageUrl = "http://example.com";
const shareText = `\uD83C\uDFB2 Nuova giocata organizzata!\n\n*${session.title}*\n\uD83D\uDCC5 ${session.date} alle ${session.time}\n\uD83D\uDCCD ${session.location}\n\nIscriviti qui: ${pageUrl}`;

console.log('Raw string:', shareText);
console.log('Encoded:', encodeURIComponent(shareText));
