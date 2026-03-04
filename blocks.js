// Définition du bloc visuel pour dpGet
Blockly.Blocks['wincc_dpget'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Lire le DP :")
        .appendField(new Blockly.FieldTextInput("System1:Motor.status"), "DP_NAME");
    this.appendDummyInput()
        .appendField("Stocker dans :")
        .appendField(new Blockly.FieldTextInput("valeur"), "VAR_NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

// Initialisation de l'espace de travail
const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox')
});

// Mise à jour du code en temps réel
workspace.addChangeListener(() => {
    const code = ctrlGenerator.workspaceToCode(workspace);
    document.getElementById('codeArea').value = code;
});
