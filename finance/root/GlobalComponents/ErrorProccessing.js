class ErrorClassification
{
    constructor({errorType, errorDescription, errorUrgency})
    {

    }
};

class CurrentSystemErrors
{
    constructor()
    {
        this.systemErrors = [];
    }

    RaiseError({errorType, errorDescription, errorUrgency}) //Error Classification Input
    {
        this.systemErrors[errorType].push({errorType, errorDescription, errorUrgency});
    }

    ClearErrorType({errorType})
    {
        //delete this.systemErrors[errorType];
    }

    GetError(index)
    {
        if(index < 0 || index > this.systemErrors.length-1)
        {
            return "";
        }

        

        return this.systemErrors[index];
        

    }


};

export default CurrentSystemErrors;