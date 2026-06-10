import React, {useEffect, useRef, useState} from "react";
import {AGLRenderWindow} from "../gl-rendering";

type ATwoJSContextComponentProps = {
    renderWindow:AGLRenderWindow
    children?: React.ReactNode
}

export function AThreeJSContextComponent(props:ATwoJSContextComponentProps) {
    const container = useRef(null as unknown as HTMLDivElement);
    useEffect(() => {
        props.renderWindow.setContainer(container.current);
        props.renderWindow.startRendering();
    });
    return (
        <div className="canvas anigraph-parent">
            <div
                className="anigraphcontainer"
                ref={container}
                key={props.renderWindow.uid}
            >
                {props.children}
            </div>
        </div>
    );
}
