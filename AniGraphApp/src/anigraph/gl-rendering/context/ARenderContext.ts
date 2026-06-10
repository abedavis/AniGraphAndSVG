/**
 * @file Manages the configuration settings for the widget.
 * @author Abe Davis
 * @description Defines the AGLContext class, which is a wrapper on the THREE.WebGLRenderer class with convenience functions.
 */
import {AObject, ASerializable} from "../../base";
import {Vec2, Vec4} from "../../math";

const _DEFAULT_WEBGLRENDERER_PARAMS = {
    alpha: true,
    preserveDrawingBuffer: true,
};

@ASerializable("ARenderContext")
export abstract class ARenderContext extends AObject {
    public renderer!:any;
    /**
     * Returns viewport as [x, y, width, height]
     * @returns {number[]}
     */
    abstract getViewport():[number, number, number, number];
    abstract setViewport(x:number|Vec4|number[],y?:number,w?:number,h?:number):void;
    abstract getShape():Vec2;
    abstract getAspect():number;

}
