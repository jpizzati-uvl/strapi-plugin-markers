import React from "react";
declare const getImgStub: (e: React.ChangeEvent<HTMLInputElement>) => {
    target: {
        value: {
            id: number;
            ext: string;
            url: string;
            hash: string;
            mime: string;
            name: string;
            size: number;
            type: string;
            width: number;
            folder: {
                id: number;
                name: string;
                path: string;
                pathId: number;
                createdAt: string;
                updatedAt: string;
            };
            height: number;
            caption: any;
            formats: {
                thumbnail: {
                    ext: string;
                    url: string;
                    hash: string;
                    mime: string;
                    name: string;
                    path: any;
                    size: number;
                    width: number;
                    height: number;
                    public_id: string;
                };
            };
            provider: string;
            createdAt: string;
            updatedAt: string;
            folderPath: string;
            previewUrl: any;
            isSelectable: boolean;
            alternativeText: any;
            provider_metadata: any;
        };
    };
    nativeEvent: Event;
    currentTarget: EventTarget & HTMLInputElement;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
};
export { getImgStub };
