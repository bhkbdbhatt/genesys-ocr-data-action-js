#!/usr/bin/env node

const { program } = require('commander');
const { validatePrerequisites } = require('../lib/check-prereqs');
const { runDeploy } = require('../lib/deploy');

program
    .name('genesys-ocr')
    .description('Genesys Cloud OCR Blueprint Installer CLI')
    .version('1.0.0');

program
    .command('deploy')
    .description('Interactively deploy the OCR Blueprint into AWS and Genesys Cloud')
    .action(async () => {
        await validatePrerequisites();
        await runDeploy();
    });

program.parse(process.argv);