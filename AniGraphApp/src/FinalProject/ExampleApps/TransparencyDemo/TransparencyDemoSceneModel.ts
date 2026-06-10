import {
    ACameraModel, AInteractionEvent, AMaterial,
    AppState, AShaderMaterial, ATriangleMeshModel, Color, GetAppState, Mat4,
    NodeTransform3D, Particle3D, Quaternion, V2,
    V3, Vec2, VertexArray3D
} from "../../../anigraph";
import {
    BillboardParticleSystemModel
} from "../../StarterCode/CustomNodes";
import {ExampleSceneModel} from "../../StarterCode/Scene/ExampleSceneModel";
import {ABlinnPhongShaderModel, BlinnPhongMaterial} from "../../../anigraph/gl-rendering/shadermodels";
import {CharacterModel, LoadedCharacterModel} from "../../../anigraph/starter/nodes/character";
import {AssetManager} from "../../../anigraph/fileio/AAssetManager";
import {AdditiveBlending, MultiplyBlending, NormalBlending, SubtractiveBlending} from "three/src/constants";
import * as THREE from "three";
import {CoordinateAxesModel} from "../../../anigraph/starter/nodes/coordinateaxes";
const PLAYER_MODEL_NAME = "duck";


function SetSquareVertsColor(verts:VertexArray3D, color:Color){
    let colorv = color.Vec4.elements;
    verts.color.setElements(
        [...colorv,...colorv,...colorv,...colorv]
    )
}

function ColorSquareVerts(scale: number = 1, color:Color) {
    let verts = new VertexArray3D();
    // verts.position = new VertexAttributeArray3D();
    verts.position.push(V3(-0.5, -0.5, 0.0).times(scale));
    verts.position.push(V3(0.5, -0.5, 0.0).times(scale));
    verts.position.push(V3(0.5, 0.5, 0.0).times(scale));
    verts.position.push(V3(-0.5, 0.5, 0.0).times(scale));
    // verts.normal = new VertexAttributeArray3D();
    verts.initNormalAttribute();
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));
    verts.normal.push(V3(0.0, 0.0, 1.0).times(scale));

    verts.initColorAttribute()
    SetSquareVertsColor(verts, color);

    // verts.indices = new VertexIndexArray(3);
    verts.initIndices();
    verts.indices.push([0, 1, 2]);
    verts.indices.push([0, 2, 3]);
    return verts;
}

export class TransparencyDemoSceneModel extends ExampleSceneModel {
    coordinateAxes!:CoordinateAxesModel;
    planes:ATriangleMeshModel[]=[];
    blendMaterial!:AShaderMaterial;

    /**
     * Optionally add some app state here. Good place to set up custom control panel controls.
     * @param appState
     */
    initAppState(appState: AppState): void {
        ABlinnPhongShaderModel.AddAppState();
    }


    async PreloadAssets() {
        await super.PreloadAssets();
        await this.LoadExampleTextures();
        await this.LoadExampleModelClassShaders()

        // You can load shader source like this if it's not already integrated into other code
        let appState = GetAppState();
        await AssetManager.loadShaderMaterialModel("diffuse");




        await AssetManager.loadModelAsset(PLAYER_MODEL_NAME);
    }

    /**
     * Here is an example of overriding the parent's initCamera.
     */
    initCamera() {
        this.cameraModel = ACameraModel.CreatePerspectiveFOV(90, 1, 0.01, 10);
        this.cameraModel.setPose(
            NodeTransform3D.LookAt(
                V3(0, -1, 1),
                V3(0,0,0),
                V3(0,0,1)
            )
        )
        this.addNode(this.cameraModel);
    }



    initExtraControls(){
        const self = this;
        GetAppState().addCheckboxControl("CullFront", false);

        this.subscribeToAppState("CullFront", (v:boolean)=>{
            if(v) {
                self.player.material.setRenderSide(AMaterial.GEOMETRY_SIDE.BACK)
            }else{
                self.player.material.setRenderSide(AMaterial.GEOMETRY_SIDE.FRONT)
            }
        })

        /**
         * Here we attach our character's shader parameters to controls in the control panel.
         * Note that the diffuse shader does not add specular shading, so the specular sliders won't do anything.
         * They will if you use a shader with the corresponding uniforms, though (like BlinnPhong)
         */
        ABlinnPhongShaderModel.attachMaterialUniformsToAppState(this.player.material);
    }

    initPlanes(){
        const self = this;
        this.blendMaterial = AssetManager.CreateShaderMaterial(AssetManager.DEFAULT_MATERIALS.RGBA_SHADER);

        function addSquare(color:Color, depth=0){
            let p = ATriangleMeshModel.Create(true,false, true);
            p.setVerts(ColorSquareVerts(1,color));
            p.setTransform(Mat4.Translation3D(0,0,depth));
            p.setMaterial(self.blendMaterial)
            self.planes.push(p);
            self.addNode(p);
            return p;
        }
        let alpha = 0.33;
        let shift = 0.5;
        let p = addSquare(Color.FromRGBA(1,0,0,alpha), 0.1);
        p.setTransform(new NodeTransform3D(V3(0,shift+0.25,0.1), Quaternion.RotationX(Math.PI/2)));

        let pb = addSquare(Color.FromRGBA(0,1,0,alpha), 0.2);
        pb.setTransform(new NodeTransform3D(V3(0.25,shift+2*0.25,0.2), Quaternion.RotationX(Math.PI/2)));

        let pc = addSquare(Color.FromRGBA(0,0,1,alpha), 0.3);
        pc.setTransform(new NodeTransform3D(V3(-0.25,shift+3*0.25,0.3), Quaternion.RotationX(Math.PI/2)));
    }


    initPlayer(){
        let playerMaterial = AssetManager.CreateShaderMaterial("diffuse");
        playerMaterial.setUniform("diffuse", 1.0);
        playerMaterial.setUniform("ambient", 0.05);
        this.player = AssetManager.createModelFromAsset(
            PLAYER_MODEL_NAME,
            LoadedCharacterModel,
            playerMaterial
        ) as LoadedCharacterModel;
        this.addNode(this.player)
    }

    initScene() {
        const self = this;
        this.addViewLight();
        this.initTerrain();
        this.terrain.material.transparent = false;
        this.terrain.reRollRandomHeightMap(0.0);
        this.initPlayer();
        this.addExampleBilboardParticleSystem();
        this.initExtraControls()
        this.initPlanes();
        this.coordinateAxes = new CoordinateAxesModel();
        this.coordinateAxes.lineWidth=0.004;
        this.addNode(this.coordinateAxes);
    }


    getCoordinatesForCursorEvent(event: AInteractionEvent){
        return event.ndcCursor??new Vec2();
    }

    /**
     * Here we will separate out logic that check to see if an object intersects the terrain.
     * @param object
     */
    adjustObjectHeight(object:Particle3D){
        let height = this.terrain.getTerrainHeightAtPoint(object.position.xy);
        if(object.position.z<height){object.position.z = height;}
    }



    timeUpdate(t: number, ...args:any[]) {

        this.timeUpdateDescendants(t);
        this.adjustObjectHeight(this.player);
        for(let ei=0;ei<this.bots.length;ei++){
            let e = this.bots[ei];
            /**
             * adjust their height
             */
            this.adjustObjectHeight(e);
        }
        // this.timeUpdateOrbitBots(t);
    }


}


