import './Input.css';
import { ChangeEvent, forwardRef, InputHTMLAttributes, Dispatch } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string,
    setErrorMessage?: Dispatch<string>,
}

export default forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { onChange, errorMessage, setErrorMessage } = props;

    function handleChange(el: ChangeEvent<HTMLInputElement>) {
        if (errorMessage && setErrorMessage) setErrorMessage('');
        if (onChange) onChange(el);
    }

    return (
        <div className="input-parent">
            <input
                {...props}
                ref={ref}
                onChange={(el) => handleChange(el)}
            />
            {errorMessage && <div className="input-error"><ExclamationCircleIcon className="input-error-icon"/>{errorMessage}</div>}
        </div>
    );
});