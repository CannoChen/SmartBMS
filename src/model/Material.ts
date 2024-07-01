import * as THREE from "three";
import {CarMaterials} from "./Car.ts";


const createCarMaterialByDefault = (): CarMaterials => {
    const transparent = {
        transparent: true,
        opacity: 0.4,
    };

    return {
        // roofMaterial: THREE.MeshPhysicalMaterial,
        // windscreenMaterial: THREE.MeshPhysicalMaterial,
        // windscreenTailMaterial: THREE.MeshPhysicalMaterial,
        trunkMaterial: new THREE.MeshPhysicalMaterial({
            // color: 0xff0000,
            metalness: 1,
            roughness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            ...transparent,
        }),
        hoodMaterial: new THREE.MeshPhysicalMaterial({
            // color: 0xff0000,
            metalness: 1,
            roughness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            ...transparent,
        }),
        doorMaterial: new THREE.MeshPhysicalMaterial({
            // color: 0xff0000,
            metalness: 1,
            roughness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            ...transparent,
        }),
        // boneMaterial: THREE.MeshPhysicalMaterial,
        // boneSubMaterial: THREE.MeshPhysicalMaterial,
        transparentMaterial: new THREE.MeshPhysicalMaterial({
            ...transparent,
        }),
    };
}

export { createCarMaterialByDefault };
