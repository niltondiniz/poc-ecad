import { RegionInfo } from "./region-info.interface";

export interface TooltipPropsInterface{
    regionInfo: RegionInfo;
    tooltipPosition: { x: number, y: number };
    isVisible: boolean;
}