const ctrlGenerator = new Blockly.Generator('CTRL');

ctrlGenerator['wincc_dpget'] = function(block) {
  const dpName = block.getFieldValue('DP_NAME');
  const varName = block.getFieldValue('VAR_NAME');
  
  // Syntaxe réelle WinCC OA CTRL
  return `anytype ${varName};\ndpGet("${dpName}", ${varName});\nDebugN("Valeur de ${dpName} :", ${varName});\n`;
};

function downloadCode() {
    const code = document.getElementById('codeArea').value;
    const blob = new Blob([code], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "script_genere.ctl";
    a.click();
}
