import React from 'react';
import { Input, type InputType } from '../atoms/Input';
import { Select, type SelectOption } from '../atoms/Select';

interface BaseFormFieldProps {
    label: string;
    name: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
}

interface InputFormFieldProps extends BaseFormFieldProps {
    type: 'input';
    inputType?: InputType;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
    type: 'select';
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

interface TextareaFormFieldProps extends BaseFormFieldProps {
    type: 'textarea';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

type FormFieldProps = InputFormFieldProps | SelectFormFieldProps | TextareaFormFieldProps;

export const FormField: React.FC<FormFieldProps> = (props) => {
    const { label, name, error, helperText, required, disabled, type } = props;

    const labelElement = (
        <label htmlFor={name} className="text-sm font-medium leading-none text-gray-900">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );

    const renderField = () => {
        switch (type) {
            case 'input':
                return (
                    <div className="space-y-2">
                        <Input
                            id={name}
                            name={name}
                            type={props.inputType}
                            value={props.value}
                            onChange={(e) => props.onChange(e.target.value)}
                            placeholder={props.placeholder}
                            error={error}
                            disabled={disabled}
                            leftIcon={props.leftIcon}
                            rightIcon={props.rightIcon}
                        />
                        {helperText && !error && (
                            <p className="text-sm text-gray-500">
                                {helperText}
                            </p>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div className="space-y-2">
                        <Select
                            id={name}
                            name={name}
                            options={props.options}
                            value={props.value}
                            onChange={(e) => props.onChange(e.target.value)}
                            placeholder={props.placeholder}
                            error={error}
                            disabled={disabled}
                        />
                        {helperText && !error && (
                            <p className="text-sm text-gray-500">
                                {helperText}
                            </p>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div className="space-y-2">
                        <textarea
                            id={name}
                            name={name}
                            value={props.value}
                            onChange={(e) => props.onChange(e.target.value)}
                            placeholder={props.placeholder}
                            rows={props.rows || 3}
                            disabled={disabled}
                            className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''
                                }`}
                        />
                        {error && (
                            <p className="text-sm text-red-600" role="alert">
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p className="text-sm text-gray-500">
                                {helperText}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-2">
            {labelElement}
            {renderField()}
        </div>
    );
};

export default FormField;
