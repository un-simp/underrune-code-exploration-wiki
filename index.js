const { Octokit } = require("@octokit/rest");

const args = process.argv;

const octokit = new Octokit({
    auth: args[2],
});

(async () => {
    try {
        const contribs = await octokit
            .request("GET /repos/{owner}/{repo}/contributors?per_page=100", {
                owner: "The0Show",
                repo: "underrune-code-exploration-wiki",
            })
            .then((res) => res.data);

        let content =
            "# Contributors\nThis is a list of contributors to this wiki. Thank you everyone for your help!\n";

        const excludedUsers = [31919211];

        for (let index = 0; index < contribs.length; index++) {
            const element = contribs[index];

            if (excludedUsers.includes(element.id)) break;

            content += `\n[${element.login}](${element.html_url})`;
        }

        await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner: "The0Show",
            repo: "underrune-code-exploration-wiki",
            path: "contributing/contributors.md",
            message: "Updated contributors",
            content: Buffer.from(content, "utf8").toString("base64url"),
        });
    } catch (e) {
        console.error(e);
    }
})();
