const Script = require('../models/script_model');

const getScript = async (req, res) => {
  const scriptId = req.query.id;
  const script = await Script.getScriptDetail(scriptId);
  res.send(script[0]);
};

const getSpecs = async (req, res) => {
  const specs = await Script.getSpecs();
  res.send(specs);
};

const getScripts = async (req, res) => {
  const scripts = await Script.getScripts();
  res.send(scripts);
};

const saveScript = async (req, res) => {
  const scriptId = req.query.id;
  const data = req.body;
  if (scriptId == 'new') {
    
    const newId = await Script.addScript(data);
    res.send(JSON.stringify(newId));
  } else{
    const updateScript = await Script.updateScript(scriptId, data);
    res.send(JSON.stringify('ok'));
  }
  
};

module.exports = {
  getScript,
  getSpecs,
  saveScript,
  getScripts,
};
