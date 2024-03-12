let manifestState = {};

// Read (Get) entire object from LocalStorage.
// Other places can use this as:
// const state = getManifest();
// state.name ...
export const getManifest = () => {
  return structuredClone(manifestState);
};

// Write (Set) entire object LocalStorage.
// Other places can use this as:
// let state = getManifest();
// state.name = "new value";
// setManifest(state);
export const setManifest = (newState) => {
  if (newState == manifestState) {
    return;
  }

  manifestState = newState;
  localStorage.setItem("manifest", JSON.stringify(newState));
};

export const readManifestFromLocalStorage = () => {
  const manifestString = localStorage.getItem("manifest");
  manifestState = JSON.parse(manifestString);
};
