import * as THREE from "three";

type CarMaterials = {
    // roofMaterial: THREE.MeshPhysicalMaterial,
    // windscreenMaterial: THREE.MeshPhysicalMaterial,
    // windscreenTailMaterial: THREE.MeshPhysicalMaterial,
    trunkMaterial: THREE.MeshPhysicalMaterial,
    hoodMaterial: THREE.MeshPhysicalMaterial,
    doorMaterial: THREE.MeshPhysicalMaterial,
    // boneMaterial: THREE.MeshPhysicalMaterial,
    // boneSubMaterial: THREE.MeshPhysicalMaterial,
    transparentMaterial: THREE.MeshPhysicalMaterial,
};

type CarComponents = {
    cells: THREE.Object3D[],
    doors: THREE.Object3D[],
    roof: THREE.Object3D | null,
    windscreen: THREE.Object3D | null,
    windscreen_tail: THREE.Object3D | null,
    trunk: THREE.Object3D | null,
    hood: THREE.Object3D | null,
    door: THREE.Object3D | null,
    bone: THREE.Object3D | null,
    bone_sub: THREE.Object3D | null,
};

/**
 * version 0.1
 * 这个版本相当的不成熟，类型的属性还在持续变动当中。
 */
class Car3dModel {
    // Components
    private car: THREE.Group;
    private readonly cells: THREE.Group;
    private cellArray: THREE.Object3D[]
    // private carComponents: CarComponents;

    constructor(carBody: THREE.Group, cells: THREE.Group, carMaterials: CarMaterials|null) {
        this.car = carBody;
        this.cells = cells;
        this.cellArray = [];
        // set and store carMaterial
        this.car.traverse(( child ) => {
            if (child?.isMesh) {  // 这里不知道为什么会报错
                console.log(child.name);

                if (child.name === "汽车顶板"){
                    child.material = carMaterials?.transparentMaterial;
                }
                // 判断是否是车前挡风玻璃
                if (child.name === "前挡风玻璃"){
                    child.material = carMaterials?.transparentMaterial;
                }
                // 判断是否是车后挡风玻璃
                if (child.name === "后挡风玻璃"){
                    child.material = carMaterials?.transparentMaterial;
                }
                // 判断是否是后备箱盖
                if (child.name === "后备箱盖"){
                    child.material = carMaterials?.trunkMaterial;
                }
                // 判断是否是引擎盖
                if (child.name === "引擎盖"){
                    child.material = carMaterials?.hoodMaterial;
                }
                // 判断是否是汽车主骨架
                if (child.name === "汽车主骨架"){
                    child.material = carMaterials?.transparentMaterial;
                }
                // 判断是否是汽车侧骨架
                if (child.name === "汽车侧骨架"){
                    child.material = carMaterials?.transparentMaterial;
                }
            }
        });
        // set and store cells
        this.cells.traverse((child) => {
            if (child?.isMesh && child.name.includes("电芯")){
                this.cellArray.push(child);
            }
        });

    }

    getCells(): THREE.Object3D[] {
        return this.cellArray;
    }

    getCar(): THREE.Group {
        return this.car;
    }
}

export default Car3dModel;
export type { CarComponents, CarMaterials };
