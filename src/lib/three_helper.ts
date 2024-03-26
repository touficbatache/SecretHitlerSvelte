export function attachMaterial(parent: any, self: any, faceIndex: number) {
  if (!Array.isArray(parent.material)) {
    parent.material = []
  }
  parent.material.splice(faceIndex, 0, self)
}
