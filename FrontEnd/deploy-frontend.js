const ftp = require("basic-ftp");
const path = require("path");
const { execSync } = require("child_process");

async function deployFront() {
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

        console.log("Building Frontend locally...");
        execSync("npm run build", {
            cwd: __dirname,
            stdio: "inherit"
        });
        console.log("Frontend build successfully completed!");

        console.log("Uploading Frontend to /www...");
        await client.cd("/");
        await client.ensureDir("/www");
        await client.cd("/www");
        await client.uploadFromDir(path.resolve(__dirname, "./dist/front-end-app/browser"));

        console.log("Uploading Frontend Routing web.config to /www...");
        await client.uploadFrom(path.resolve(__dirname, "../webconfig-frontend.txt"), "web.config");

        console.log("✅ Frontend uploaded successfully.");
    }
    catch (err) {
        console.log("❌ Error:", err)
    }
    client.close()
}

deployFront();
