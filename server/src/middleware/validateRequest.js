export const validateRequest = (schema, target = 'body') => {
    return async (req, res, next) => {
        let dataToValidate;
        
        switch (target) {
            case 'query':
                dataToValidate = req.query;
                break;
            case 'params':
                dataToValidate = req.params;
                break;
            case 'body':
            default:
                dataToValidate = req.body;
                break;
        }
        
        const result = schema.safeParse(dataToValidate);
        
        if (!result.success) {
            const formattedErrors = Object.entries(result.error.format())
                .filter(([key]) => key !== "_errors")
                .map(([field, error]) => ({
                    field,
                    message: Array.isArray(error) ? error.join(", ") : error._errors?.join(", ") || "Invalid input"
                }));
                
            res.status(400).json({
                success: false,
                message: "Validation Failed.",
                errors: formattedErrors
            });
            return;
        }
        
        switch (target) {
            case 'query':
                // Don't reassign req.query directly, instead update individual properties
                Object.keys(result.data).forEach(key => {
                    req.query[key] = result.data[key];
                });
                break;
            case 'params':
                req.params = result.data;
                break;
            case 'body':
            default:
                req.body = result.data;
                break;
        }
        
        next();
    };
};

export default validateRequest;