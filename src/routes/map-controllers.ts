const path = require('path');
const fs = require('fs');
const { src } = require("../../package.json");

const directoryPath = path.join(__dirname, `../${src.controllers}`);

export const listControllers = async () => {
    const files = await fs.promises.readdir(directoryPath);

    return files.map(function (file: any) {
        if (file.includes('.ts') && !file.includes('.d.ts')) {
            const controller = require(`../${src.controllers}/${file}`);
            return controller.default;
        }

        try {
            const controller = require(`../${src.controllers}/${file}/index.ts`);
            return controller.default;
        } catch(error) {}
    });
}