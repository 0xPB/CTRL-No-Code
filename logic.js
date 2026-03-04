/**
 * CONFIGURATION DES BLOCS WINCC OA (V1.2)
 */
Blockly.defineBlocksWithJsonArray([
    // --- VARIABLES ---
    {
        "type": "wincc_variable",
        "message0": "Déclarer %1 %2 = %3",
        "args0": [
            {
                "type": "field_dropdown", "name": "TYPE",
                "options": [
                    ["bool", "bool"], ["int", "int"], ["float", "float"], 
                    ["string", "string"], ["time", "time"], ["anytype", "anytype"]
                ]
            },
            { "type": "field_input", "name": "VAR_NAME", "text": "maVariable" },
            { "type": "field_input", "name": "VALUE", "text": "0" }
        ],
        "previousStatement": null, "nextStatement": null, "colour": 160
    },

    // --- ACCÈS DONNÉES ---
    {
        "type": "wincc_dpget",
        "message0": "Lire DP %1 → %2",
        "args0": [
            { "type": "field_input", "name": "DP_NAME", "text": "System1:Motor.status" },
            { "type": "field_input", "name": "VAR_NAME", "text": "maVariable" }
        ],
        "previousStatement": null, "nextStatement": null, "colour": 230
    },
    {
        "type": "wincc_dpset",
        "message0": "Écrire %1 → DP %2",
        "args0": [
            { "type": "field_input", "name": "VALUE", "text": "1" },
            { "type": "field_input", "name": "DP_NAME", "text": "System1:Cmd.start" }
        ],
        "previousStatement": null, "nextStatement": null, "colour": 0
    },

    // --- LOGIQUE & TEMPS ---
    {
        "type": "wincc_delay",
        "message0": "Attendre %1 secondes",
        "args0": [{ "type": "field_number", "name": "SEC", "value": 1 }],
        "previousStatement": null, "nextStatement": null, "colour": 260
    },
    {
        "type": "wincc_debug",
        "message0": "Afficher dans log: %1",
        "args0": [{ "type": "field_input", "name": "TEXT", "text": "Action effectuée" }],
        "previousStatement": null, "nextStatement": null, "colour": 120
    },
    {
        "type": "logic_if_custom",
        "message0": "Si %1 %2 %3 alors",
        "args0": [
            { "type": "field_input", "name": "VAR", "text": "maVariable" },
            { "type": "field_dropdown", "name": "OP", "options": [["==", "=="], ["!=", "!="], [">", ">"], ["<", "<"]] },
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

ctrlGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.getNextBlock();
    const nextCode = opt_thisOnly ? '' : ctrlGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// Traductions
ctrlGenerator.forBlock['wincc_variable'] = block => {
    let val = block.getFieldValue('VALUE');
    if (block.getFieldValue('TYPE') === 'string' && !val.includes('"')) val = `"${val}"`;
    return `${block.getFieldValue('TYPE')} ${block.getFieldValue('VAR_NAME')} = ${val};\n`;
};

ctrlGenerator.forBlock['wincc_dpget'] = block => 
    `dpGet("${block.getFieldValue('DP_NAME')}", ${block.getFieldValue('VAR_NAME')});\n`;

ctrlGenerator.forBlock['wincc_dpset'] = block => 
    `dpSet("${block.getFieldValue('DP_NAME')}", ${block.getFieldValue('VALUE')});\n`;

ctrlGenerator.forBlock['wincc_delay'] = block => 
    `delay(${block.getFieldValue('SEC')});\n`;

ctrlGenerator.forBlock['wincc_debug'] = block => 
    `DebugN("${block.getFieldValue('TEXT')}");\n`;

ctrlGenerator.forBlock['logic_if_custom'] = block => {
    const branch = ctrlGenerator.statementToCode(block, 'DO');
    return `if (${block.getFieldValue('VAR')} ${block.getFieldValue('OP')} ${block.getFieldValue('VAL_COMP')}) {\n${branch}}\n`;
};

/**
 * INITIALISATION
 */
const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    grid: { spacing: 20, length: 3, colour: '#ccc', snap: true }
});

// MISE À JOUR : On encapsule le code dans int main()
workspace.addChangeListener(() => {
    const rawCode = ctrlGenerator.workspaceToCode(workspace);
    const formattedCode = `int main()\n{\n${rawCode.split('\n').map(line => line ? '  ' + line : '').join('\n')}\n  return 0;\n}`;
    document.getElementById('codeArea').value = formattedCode;
});

function downloadCode() {
    const code = document.getElementById('codeArea').value;
    const blob = new Blob([code], {type: "text/plain"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "script_wincc.ctl";
    a.click();
}
