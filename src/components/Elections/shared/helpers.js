export const getMapBoxProperties = mapBoxProps => {
  const [props] = mapBoxProps
  const { properties: { nom: zoneName, code: zoneCode } = {} } = props || {}
  return { zoneName, zoneCode }
}

export const getElectionPayload = (activeLayer, filterValues, zoneCode) => {
  const { election = '', year = '', round: stage = '' } = filterValues
  return {
    election: `${election} ${year}`,
    layerCode: activeLayer,
    zoneCode,
    stage,
  }
}
