const Validator = require('jsonschema').Validator;
const fs = require('fs');
const exampleFolderPath = __dirname + '/../example/';
const schemaPath = __dirname + '/../resources/schema.json';

async function parseJsonWithErrorHandling(path) {
    const rawBuffer = await fs.promises.readFile(path);

    try {
        return JSON.parse(rawBuffer.toString('utf8'));
    } catch (e) {
        console.error('Unable to parse instance: ' + e.message);
        process.exit(1);
    }
}

async function validateFile(fileName) {
    const validator = new Validator();

    const instance = await parseJsonWithErrorHandling(exampleFolderPath + fileName);
    const schema = await parseJsonWithErrorHandling(schemaPath);

    const result = validator.validate(instance, schema);

    if (!result.valid) {
        console.error(fileName + ': Schema or example are not valid. Errors:');

        result.errors.forEach((error) => {
            console.error(error.property + ' ' + error.message);
        });

        process.exit(1);
    } else {
        console.log(fileName + ': Schema and example are valid.');
    }
}

function main() {
    fs.readdir(exampleFolderPath, (err, files) => {
        files.forEach(fileName => validateFile(fileName));
    });
}

main();
