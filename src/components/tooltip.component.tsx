import { TooltipPropsInterface } from "../interfaces/tooltip-props.interface"
import { formatTime } from "../utils/helpers"

export const TooltipComponent = (props: {tooltipProps: TooltipPropsInterface, tooltipPosition: any}) => {

    return  props.tooltipProps && props.tooltipProps.isVisible ?

        <div
            id="tooltip"
            className="tooltip"
            style={{
                position: 'absolute',
                left: props.tooltipPosition.x + 16,
                top: props.tooltipPosition.y,
                maxWidth: 250,
                backgroundColor: '#6a5e5e',
                opacity: 0.9,
                borderRadius: 9,
                zIndex: 1000,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'left',
                padding: 16,
                color: '#f9f7f7',
                fontWeight: '500',

            }}
        >
            <div>
                <h4>{props.tooltipProps.regionInfo.title}</h4>
                <p>{props.tooltipProps.regionInfo.author}</p>
                <ul>
                    <li>Inicio: {formatTime(props.tooltipProps.regionInfo.start)}</li>
                    <li>Fim: {formatTime(props.tooltipProps.regionInfo.end)}</li>
                    <li>Duração: {formatTime(props.tooltipProps.regionInfo.duration)}</li>
                </ul>
            </div>

        </div> : <div></div>


}