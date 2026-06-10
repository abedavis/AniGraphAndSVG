import {AObject} from "../../base";
import {ARenderWindow} from "./ARenderWindow";
import {ARenderContext} from "./ARenderContext";
import {ConfirmInitialized} from "../../scene/ConfirmInitialized";




export interface ARenderDelegate extends ConfirmInitialized{
    get isReadyToRender():boolean;
    initRendering(contextView:ARenderWindow):Promise<void>;
    onAnimationFrameCallback(context:ARenderContext):void;
    onWindowResize(renderWindow:ARenderWindow):void;
    get renderWindow():ARenderWindow;
    setRenderWindow(renderWindow: ARenderWindow):void;
    setContext(context:ARenderContext):void;
    initContext():void;
    get context():ARenderContext;
}

// type RenderDelegate implements ARenderDe
