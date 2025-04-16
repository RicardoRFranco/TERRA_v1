import { useState, useCallback } from 'react';

/**
 * Custom hook for form state management
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Form submission handler
 * @param {Function} validate - Form validation function
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, onSubmit = () => {}, validate = () => ({})) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    
    /**
     * Reset form to initial state or new values
     * 
     * @param {Object} newValues - New form values (optional)
     */
    const resetForm = useCallback((newValues = initialValues) => {
        setValues(newValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);
    
    /**
     * Set a single form value
     * 
     * @param {string} name - Field name
     * @param {any} value - Field value
     */
    const setValue = useCallback((name, value) => {
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);
    
    /**
     * Set multiple form values
     * 
     * @param {Object} newValues - New values to set
     */
    const setMultipleValues = useCallback((newValues) => {
        setValues(prev => ({
            ...prev,
            ...newValues
        }));
    }, []);
    
    /**
     * Handle field change event
     * 
     * @param {Event} e - Change event
     */
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle different input types
        const fieldValue = type === 'checkbox' ? checked : value;
        
        setValues(prev => ({
            ...prev,
            [name]: fieldValue
        }));
        
        // Validate field if it's been touched
        if (touched[name]) {
            const validationErrors = validate({ ...values, [name]: fieldValue });
            setErrors(prev => ({
                ...prev,
                [name]: validationErrors[name]
            }));
        }
    }, [values, touched, validate]);
    
    /**
     * Handle field blur event
     * 
     * @param {Event} e - Blur event
     */
    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        
        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        
        // Validate field
        const validationErrors = validate(values);
        setErrors(prev => ({
            ...prev,
            [name]: validationErrors[name]
        }));
    }, [values, validate]);
    
    /**
     * Handle form submission
     * 
     * @param {Event} e - Submit event
     */
    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault();
        
        // Validate all fields
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        // Increment submit count
        setSubmitCount(prev => prev + 1);
        
        // Check if form is valid
        const isValid = Object.keys(validationErrors).length === 0;
        
        if (isValid) {
            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [values, validate, onSubmit]);
    
    /**
     * Check if form is valid
     * 
     * @returns {boolean} Form validity
     */
    const isValid = useCallback(() => {
        const validationErrors = validate(values);
        return Object.keys(validationErrors).length === 0;
    }, [values, validate]);
    
    /**
     * Get props for a field
     * 
     * @param {string} name - Field name
     * @returns {Object} Field props
     */
    const getFieldProps = useCallback((name) => ({
        name,
        value: values[name] || '',
        onChange: handleChange,
        onBlur: handleBlur,
        'aria-invalid': !!errors[name],
        'aria-describedby': errors[name] ? `${name}-error` : undefined
    }), [values, errors, handleChange, handleBlur]);
    
    return {
        values,
        errors,
        touched,
        isSubmitting,
        submitCount,
        handleChange,
        handleBlur,
        handleSubmit,
        setValue,
        setMultipleValues,
        resetForm,
        isValid,
        getFieldProps
    };
};

export default useForm;