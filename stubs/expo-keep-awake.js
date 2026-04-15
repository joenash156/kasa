const ExpoKeepAwakeTag = "ExpoKeepAwakeDefaultTag";

function useKeepAwake() {}

async function activateKeepAwake() {}

async function activateKeepAwakeAsync() {}

async function deactivateKeepAwake() {}

function addListener() {
  return {
    remove() {},
  };
}

module.exports = {
  ExpoKeepAwakeTag,
  useKeepAwake,
  activateKeepAwake,
  activateKeepAwakeAsync,
  deactivateKeepAwake,
  addListener,
};
