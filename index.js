const path = require('path');

module.exports = {
    getTerraformDirPath: () => path.join(__dirname, 'templates/terraform'),
    getArchyFlowPath: () => path.join(__dirname, 'templates/archy/ocr_flow.yaml'),
    getContractSchemas: () => ({
        input: require('./templates/terraform/contracts/input_schema.json'),
        output: require('./templates/terraform/contracts/output_schema.json')
    })
};