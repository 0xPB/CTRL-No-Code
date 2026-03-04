/**
 * CONFIGURATION DES BLOCS WINCC OA
 */

Blockly.defineBlocksWithJsonArray([
    // Bloc Déclaration de Variable
    {
        "type": "wincc_variable",
        "message0": "Déclarer %1 %2 = %3",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "TYPE",
                "options": [
                    ["bool", "bool"], ["int", "int"], ["float", "float"], 
                    ["string", "string"], ["time", "time"], ["dyn_int", "dyn_int"], 
                    ["dyn_string", "dyn_string"], ["anytype", "anytype"]
                ]
            },
            { "type": "field_input", "name": "VAR_NAME", "text": "maVariable" },
            { "type": "field_input", "name": "VALUE", "text": "0" }
        ],
        "previousStatement": null, "nextStatement": null, "colour": 160
    },
    // Bloc dpGet
    {
        "type": "wincc_dpget",
        "message0": "Lire DP %1 dans %2",
        "args0": [
            { "type": "field_input", "name": "DP_NAME", "text": "System1:Motor.status" },
            { "type": "field_input", "name": "VAR_NAME", "text": "maVariable" }
        ],
        "previousStatement": null, "nextStatement": null, "colour": 230
    },
    // Bloc dpSet
    {
        "type": "wincc_dpset",
        "message0": "Écrire %1 dans DP %2",
        "args0": [
            { "type": "field_input", "name": "VALUE", "text": "1" },
            { "type": "field_input", "name": "DP_NAME", "text": "System1:Cmd.start" }
        ],
        "previousStatement": null, "nextStatement": null, "colour": 0
    },
    // Bloc If Custom
    {
        "type": "logic_if_custom",
        "message0": "Si %1 == %2 alors",
        "args0": [
            { "type": "field_input", "name": "VAR", "text": "maVariable" },
            { "type": "field_input", "name": "VAL_COMP", "text": "1" }
        ],
        "message1": "%1",
        "args1": [{ "type": "input_statement", "name": "DO" }],
        "previousStatement": null, "nextStatement": null, "colour": 210
    }
]);

/**
 * GÉNÉRATEUR DE CODE CTRL
 */

const ctrlGenerator = new Blockly.Generator('CTRL');

// Gère l'enchaînement des blocs
ctrlGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = opt_thisOnly ? '' : ctrlGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// Logique Variable
ctrlGenerator.forBlock['wincc_variable'] = function(block) {
    const type = block.getFieldValue('TYPE');
    const name = block.getFieldValue('VAR_NAME');
    let value = block.getFieldValue('VALUE');
    if (type === 'string' && !value.includes('"')) value = `"${value}"`;
    return `${type} ${name} = ${value};\n`;
};

// Logique dpGet
ctrlGenerator.forBlock['wincc_dpget'] = function(block) {
    return `dpGet("${block.getFieldValue('DP_NAME')}", ${block.getFieldValue('VAR_NAME')});\n`;
};

// Logique dpSet
ctrlGenerator.forBlock['wincc_dpset'] = function(block) {
    return `dpSet("${block.getFieldValue('DP_NAME')}", ${block.getFieldValue('VALUE')});\n`;
};

// Logique If
ctrlGenerator.forBlock['logic_if_custom'] = function(block) {
    const branch = ctrlGenerator.statementToCode(block, 'DO');
    return `if (${block.getFieldValue('VAR')} == ${block.getFieldValue('VAL_COMP')}) {\n${branch}}\n`;
};

/**
 * INITIALISATION DE L'INTERFACE
 */

const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
    zoom: { controls: true, wheel: true }
});

// Mise à jour en temps réel
workspace.addChangeListener(() => {
    const code = ctrlGenerator.workspaceToCode(workspace);
    document.getElementById('codeArea').value = code;
});

// Fonction de téléchargement
function downloadCode() {
    const code = document.getElementById('codeArea').value;
    const finalFile = `main()\n{\n${code}\n}`;
    const blob = new Blob([finalFile], {type: "text/plain"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "script_wincc.ctl";
    a.click();
}
