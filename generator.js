// 1. Initialiser le générateur pour notre langage personnalisé "CTRL"
const ctrlGenerator = new Blockly.Generator('CTRL');

// 2. Définir comment transformer le bloc 'wincc_dpget' en code texte
ctrlGenerator.forBlock['wincc_dpget'] = function(block) {
  const dpName = block.getFieldValue('DP_NAME');
  const varName = block.getFieldValue('VAR_NAME');
  
  // Retourne le code formaté pour WinCC OA
  return `anytype ${varName};\ndpGet("${dpName}", ${varName});\nDebugN("Valeur de ${dpName} :", ${varName});\n`;
};

// 3. Fonction pour mettre à jour la zone de texte à chaque changement
function updateCode() {
  const code = ctrlGenerator.workspaceToCode(workspace);
  document.getElementById('codeArea').value = code;
}

// 4. Écouter les changements dans l'espace de travail Blockly
workspace.addChangeListener(updateCode);

// 5. Fonction de téléchargement
function downloadCode() {
    const code = document.getElementById('codeArea').value;
    if(!code) { alert("Glisse un bloc d'abord !"); return; }
    const blob = new Blob([code], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "script_genere.ctl";
    a.click();
}
