function getTypeIdByName(types, name) {
  const matchedType = types.find(type => {
    return type.name === name;
  });
  return matchedType.id;
}

module.exports = {
  getTypeIdByName: getTypeIdByName
};