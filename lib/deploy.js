const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const { execa } = require('execa');
const chalk = require('chalk');

async function runDeploy() {
    console.log(chalk.bold.cyan('\n🚀 Welcome to Genesys Cloud OCR Blueprint Installer\n'));

    // 1. Collect deployment variables
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'awsRegion',
            message: 'AWS Region to deploy App Runner:',
            default: 'us-east-1'
        },
        {
            type: 'password',
            name: 'ocrApiKey',
            message: 'Create a secret API key for Genesys Data Action auth:'
        },
        {
            type: 'input',
            name: 'genesysClientId',
            message: 'Genesys Cloud OAuth Client ID:'
        },
        {
            type: 'password',
            name: 'genesysClientSecret',
            message: 'Genesys Cloud OAuth Client Secret:'
        },
        {
            type: 'input',
            name: 'genesysRegion',
            message: 'Genesys Cloud AWS Region:',
            default: 'us-east-1'
        }
    ]);

    // 2. Copy blueprint template files into current directory
    const targetDir = process.cwd();
    const templateDir = path.join(__dirname, '../templates');

    console.log(chalk.blue('\nCopying blueprint files to current directory...'));
    await fs.copy(templateDir, targetDir);

    // 3. Generate terraform.tfvars file
    const tfvarsContent = `
aws_region            = "${answers.awsRegion}"
ocr_api_key           = "${answers.ocrApiKey}"
genesys_client_id     = "${answers.genesysClientId}"
genesys_client_secret = "${answers.genesysClientSecret}"
genesys_aws_region    = "${answers.genesysRegion}"
`;

    await fs.writeFile(path.join(targetDir, 'terraform', 'terraform.tfvars'), tfvarsContent);
    console.log(chalk.green('✔ Generated terraform/terraform.tfvars'));

    // 4. Offer automated Terraform execution
    const { proceedTf } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'proceedTf',
            message: 'Would you like to run `terraform apply` now?',
            default: true
        }
    ]);

    if (proceedTf) {
        console.log(chalk.blue('\nInitializing and applying Terraform plan...\n'));
        await execa('terraform', ['init'], { cwd: path.join(targetDir, 'terraform'), stdio: 'inherit' });
        await execa('terraform', ['apply', '-auto-approve'], { cwd: path.join(targetDir, 'terraform'), stdio: 'inherit' });
        console.log(chalk.bold.green('\n✔ Terraform infrastructure deployed successfully!'));
    } else {
        console.log(chalk.yellow('\nNext step: cd into terraform/ and run `terraform apply`.'));
    }
}

module.exports = { runDeploy };