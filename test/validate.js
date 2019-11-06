const Validator = require('jsonschema').Validator;
const fs = require('fs').promises;

async function parseJsonWithErrorHandling(path) {
    const rawBuffer = await fs.readFile(path);

    try {
        return JSON.parse(rawBuffer.toString('utf8'));
    } catch (e) {
        console.error('Unable to parse instance: ' + e.message);
        process.exit(1);
    }
}

async function main() {
    const validator = new Validator();

    const instance = await parseJsonWithErrorHandling(__dirname + '/../example/response.json');
    const schema = await parseJsonWithErrorHandling(__dirname + '/../resources/schema.json');

    const result = validator.validate(instance, schema);

    if (!result.valid) {
        console.error('Schema or example are not valid. Errors:');

        result.errors.forEach((error) => {
            console.error(error.property + ' ' + error.message);
        });

        process.exit(1);
    } else {
        console.log('Schema and example are valid.');
    }
}

main();