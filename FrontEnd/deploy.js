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

        try {
            console.log("Building Backend locally (Self-Contained win-x86)...");
            const { execSync } = require("child_process");
            const backendPath = path.resolve(__dirname, "../BackEnd/FortunatoAgricola.API");
            execSync("dotnet publish -c Release -r win-x86 --self-contained true -p:PublishSingleFile=false -p:PublishTrimmed=false -o publish-x86", {
                cwd: backendPath,
                stdio: "inherit"
            });
            console.log("Build successfully completed!");

            console.log("Uploading Backend to /www/api...");
            await client.ensureDir("/www/api");
            await client.cd("/www/api");

            console.log("Creating app_offline.htm to stop the app pool...");
            const fs = require('fs');
            const offlineFile = path.resolve(__dirname, "../app_offline.htm");
            fs.writeFileSync(offlineFile, "<html><body><h1>Site em Manutencao</h1><p>Atualizando backend...</p></body></html>");
            await client.uploadFrom(offlineFile, "app_offline.htm");

            // Clear old backend files to avoid garbage
            console.log("Clearing /www/api...");
            try {
                await client.clearWorkingDir();
            } catch (clearErr) {
                console.log("⚠️ Could not clear all files in /www/api (some might be locked). Continuing...");
            }

            console.log("Uploading from publish-x86...");
            const publishFolder = path.resolve(__dirname, "../BackEnd/FortunatoAgricola.API/publish-x86");
            if (fs.existsSync(path.join(publishFolder, 'web.config'))) {
                fs.unlinkSync(path.join(publishFolder, 'web.config'));
            }

            await client.uploadFromDir(publishFolder);
            console.log("Uploading predefined root webconfig.txt to web.config...");
            await client.uploadFrom(path.resolve(__dirname, "../webconfig.txt"), "web.config");
            
            console.log("Removing app_offline.htm...");
            await client.remove("app_offline.htm");
            
            if (fs.existsSync(offlineFile)) fs.unlinkSync(offlineFile);

            console.log("✅ Backend uploaded successfully.");
        } catch (backendErr) {
            console.log("❌ Partial or total failure in Backend upload. Continuing with Frontend...", backendErr);
            // Try to remove app_offline anyway
            try { await client.remove("app_offline.htm"); } catch(e) {}
        }

        console.log("Building Frontend locally...");
        const { execSync } = require("child_process");
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
        console.log("❌ General Error:", err)
    }
    client.close()
}

deploy();
