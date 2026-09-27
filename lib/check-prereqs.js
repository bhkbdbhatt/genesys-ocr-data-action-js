const { execa } = require('execa');
const chalk = require('chalk');

async function checkTool(command, args, toolName) {
    try {
        await execa(command, args);
        console.log(chalk.green(`✔ ${toolName} is installed.`));
        return true;
    } catch (err) {
        console.log(chalk.red(`✖ ${toolName} is not installed or not in PATH.`));
        return false;
    }
}

async function validatePrerequisites() {
    console.log(chalk.blue('\nChecking system prerequisites...\n'));

    const results = await Promise.all([
        checkTool('aws', ['--version'], 'AWS CLI'),
        checkTool('terraform', ['-version'], 'Terraform CLI'),
        checkTool('archy', ['version'], 'Genesys Archy CLI')
    ]);

    if (results.includes(false)) {
        console.log(chalk.yellow('\nPlease install missing tools before continuing.'));
        process.exit(1);
    }
}

module.exports = { validatePrerequisites };