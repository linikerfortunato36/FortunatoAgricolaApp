const ftp = require("basic-ftp");
const path = require("path");

async function deploy() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "ftp.web22f49.kinghost.net",
            user: "fortunatoagricola",
            password: "Admfortunato36",
            secure: false
        })
        console.log("Connected to FTP.");

        console.log("Uploading Backend to /www/api...");
        await client.ensureDir("/www/api");
        await client.cd("/www/api");
        // Clear old backend files to avoid garbage
        await client.clearWorkingDir();
        await client.uploadFromDir(path.resolve(__dirname, "../BackEnd/FortunatoAgricola.API/publish-x86"));
        console.log("✅ Backend uploaded successfully.");

        // console.log("Uploading Frontend to /www...");
        // await client.cd("/");
        // await client.ensureDir("/www");
        // await client.cd("/www");
        // await client.uploadFromDir(path.resolve(__dirname, "./dist/front-end-app/browser"));
        // console.log("✅ Frontend uploaded successfully.");
    }
    catch (err) {
        console.log("❌ Error:", err)
    }
    client.close()
}

deploy();
