const fs = require('fs');
const path = require('path');

// Helper to recursively copy directories
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to recursively delete directories
function deleteDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

try {
  console.log("Starting project restructuring...");

  const oldGkDir = path.join(__dirname, 'chitragupta', 'questions');
  const oldVocabDir = path.join(__dirname, 'vocab', 'questions');

  const newGkDir = path.join(__dirname, 'questions', 'gk');
  const newVocabDir = path.join(__dirname, 'questions', 'vocab');

  // 1. Move GK questions
  if (fs.existsSync(oldGkDir)) {
    console.log(`Copying GK questions from ${oldGkDir} to ${newGkDir}...`);
    copyDirSync(oldGkDir, newGkDir);
  } else {
    console.log("GK questions folder not found in old path.");
  }

  // 2. Move Vocab questions
  if (fs.existsSync(oldVocabDir)) {
    console.log(`Copying Vocab questions from ${oldVocabDir} to ${newVocabDir}...`);
    copyDirSync(oldVocabDir, newVocabDir);
  } else {
    console.log("Vocab questions folder not found in old path.");
  }

  // 3. Verify copy
  const gkCount = fs.existsSync(newGkDir) ? fs.readdirSync(newGkDir).length : 0;
  const vocabCount = fs.existsSync(newVocabDir) ? fs.readdirSync(newVocabDir).length : 0;
  console.log(`Verification: Copied ${gkCount} GK questions and ${vocabCount} Vocab questions.`);

  // 4. Delete old folders
  console.log("Deleting old legacy folders (chitragupta and vocab)...");
  deleteDirSync(path.join(__dirname, 'chitragupta'));
  deleteDirSync(path.join(__dirname, 'vocab'));

  // 5. Clean up restore script
  const restoreScript = path.join(__dirname, 'restore_questions.js');
  if (fs.existsSync(restoreScript)) {
    fs.unlinkSync(restoreScript);
  }

  console.log("Project restructuring completed successfully!");
} catch (err) {
  console.error("Restructuring failed:", err.message);
}
