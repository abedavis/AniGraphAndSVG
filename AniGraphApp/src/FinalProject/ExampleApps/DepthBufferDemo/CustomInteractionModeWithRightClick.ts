import {ADebugInteractionMode} from "../../../anigraph/starter";
import {AInteractionEvent, AKeyboardInteraction, ARightClickInteraction} from "../../../anigraph";
import {DepthBufferDemoSceneController} from "./DepthBufferDemoSceneController";

export class CustomInteractionModeWithRightClick extends ADebugInteractionMode{
    static NameInGUI = "RightClickExample"
    get owner(): DepthBufferDemoSceneController {
        return this._owner as DepthBufferDemoSceneController;
    }

    onRightClick(event: AInteractionEvent, interaction: ARightClickInteraction) {
        console.log("RIGHT CLICK!");
        console.log(event);
        // super.onRightClick(event, interaction);
    }

    onKeyUp(event:AInteractionEvent, interaction:AKeyboardInteraction){
        if(!interaction.keysDownState['w']){
        }
        if(!interaction.keysDownState['a']){
        }
        if(!interaction.keysDownState['s']){
        }
        if(!interaction.keysDownState['d']){
        }
        if(!interaction.keysDownState['r']){
        }
        if(!interaction.keysDownState['f']){
        }

    }
}
