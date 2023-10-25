
import ErrorStatus from "./ErrorMessage"




export default function Layout({children})
{

    
    return (
    <div>
        {ErrorStatus.render()}
        <div>
            {children}
        </div>
    </div>);
}



