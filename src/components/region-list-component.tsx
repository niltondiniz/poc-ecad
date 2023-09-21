import { useState } from "react";

interface RegionEntity{
    id: string;
    start: number;
    end: number;
    content: string;
}

interface Props{
    regions: RegionEntity[];
}

export const RegionListComponent = (props: Props) => {
    

    return(
        //Lista de regiões
        <div>
            {
                props.regions.map((region) => {
                    return(
                        <div key={region.start}>
                            <span>{region.content}</span>
                            <button>Remover</button>
                        </div>
                    )
                })
            }
        </div>
        
    )


}