import {ExampleSceneController} from "../../StarterCode/Scene/ExampleSceneController";
import {Color, GetAppState} from "../../../anigraph";
import {TransparencyDemoSceneModel} from "./TransparencyDemoSceneModel";
import * as THREE from "three";

export class TransparencyDemoSceneController extends ExampleSceneController{
    get model():TransparencyDemoSceneModel{
        return this._model as TransparencyDemoSceneModel;
    }

    /**
     * This is where you specify the mapping from model classes to view classes.
     */
    initModelViewSpecs(): void {
        super.initModelViewSpecs();
        this.addExampleModelViewSpecs();
    }

    addTransparencyControls(){
        const self = this;
        GetAppState().addCheckboxControl("SortObjects", false);
        this.subscribeToAppState("SortObjects", (v:boolean)=>{
            self.renderer.sortObjects = v;
        })

        const BlendOptions = [
            "Normal",
            "Additive",
            "Subtractive",
            "Multiply"
        ]

        let appState = GetAppState();
        appState.setSelectionControl(
            "BlendType",
            "Normal",
            BlendOptions
        )

        function updatemats(){
            for(let p of self.model.planes){
                p.signalMaterialUpdate()
            }
        }
        self.subscribe(appState.addStateValueListener("BlendType",
            (selection:any)=>{
                switch (selection){
                    case BlendOptions[0]:
                        self.model.blendMaterial.setBlendingMode(THREE.NormalBlending);
                        updatemats();
                        break;
                    case BlendOptions[1]:
                        self.model.blendMaterial.setBlendingMode(THREE.AdditiveBlending);
                        updatemats();
                        break;
                    case BlendOptions[2]:
                        self.model.blendMaterial.setBlendingMode(THREE.SubtractiveBlending);
                        updatemats();
                        break;
                    case BlendOptions[3]:
                        self.model.blendMaterial.setBlendingMode(THREE.MultiplyBlending);
                        updatemats();
                        break;
                    default:
                        console.log(`Unrecognized selection ${selection}`);
                        break;
                }
            }), "BlendSubscription");

        GetAppState().addCheckboxControl("DepthWrite", false);
        this.subscribeToAppState("DepthWrite", (v:boolean)=>{
            self.model.blendMaterial.depthWrite = v;
            updatemats();
        })

        GetAppState().addCheckboxControl("DepthTest", false);
        this.subscribeToAppState("DepthTest", (v:boolean)=>{
            self.model.blendMaterial.depthTest = v;
            updatemats();
        })


        GetAppState().addCheckboxControl("GroundTransparent", false);
        this.subscribeToAppState("GroundTransparent", (v:boolean)=>{
            self.model.terrain.material.setValue('transparent',v)
            self.model.terrain.signalMaterialUpdate()
        })

        GetAppState().addSliderIfMissing("Alpha", 0.3, 0.0, 1.0, 0.01);
        this.subscribeToAppState("Alpha", (v:number)=>{
            for(let p of self.model.planes){
                let color = p.verts.color.getAt(0);
                color.a = v;
                let colorv = color.Vec4.elements;
                p.verts.color.setElements(
                    [...colorv,...colorv,...colorv,...colorv]
                )
                p.signalGeometryUpdate()
            }
        })

        GetAppState().addSliderIfMissing("AxesScale", 1.0, 0.0, 5.0, 0.01);
        this.subscribeToAppState("AxesScale", (v:number)=>{
            self.model.coordinateAxes.axesScale = v;
        })

        GetAppState().addSliderIfMissing("AxesLineWidth", 0.004, 0.0, 0.5, 0.0001);
        this.subscribeToAppState("AxesLineWidth", (v:number)=>{
            self.model.coordinateAxes.lineWidth = v;
        })

    }

    async initScene(): Promise<void> {
        await super.initScene()
        this.initSkyBoxCubeMap();
        this.setClearColor(Color.Black());
        this.addTransparencyControls();
    }

    initInteractions() {
        super.initInteractions();
        this.initExampleInteractions();

    }

}




