const ftp = require("basic-ftp");
const path = require("path");

async function check() {
    const client = new ftp.Client()
    try {
        await client.access({
            host: "ftp.web22f49.kinghost.net",
            user: "fortunatoagricola",
            password: "Admfortunato36",
            secure: false
        })
        const list = await client.list("/www/api/logs");
        console.log(list.map(f => f.name));
        if (list.length > 0) {
            await client.downloadTo(path.resolve(__dirname, "server_log.txt"), "/www/api/logs/" + list[0].name);
        }
    }
    catch (err) {
        console.log("Error:", err)
    }
    client.close()
}
check();
