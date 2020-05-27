// import * as THREE from 'three'
import { BasePart } from '~/plugins/three/parts/basePart'

export class WorkPart extends BasePart {
  constructor (type, uuid, position, energyLevel = 50) {
    super(type, uuid, position)
    this.energyLevel = energyLevel
    this.fileUrl = 'lorem-object-2'

    this.labelSettings = {
      initText: 'Item',
      x: 0,
      y: 0.12,
      z: -0.2
    }
  }

  initDeforms () {
    this.updateEnergy(this.energyLevel)
  }

  updateEnergy (energy) {
    const morphingPart = this.scene.children[0]
    morphingPart.morphTargetInfluences[0] = energy / 100
  }
}
