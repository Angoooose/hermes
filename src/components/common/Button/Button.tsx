import './Button.css';

import { ButtonHTMLAttributes } from 'react';
import { BeatLoader } from 'react-spinners';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string,
    isLoading?: boolean,
    isRed?: boolean,
}

export default function Button(props: ButtonProps) {
    return (
        <button {...props} className={`${props.className ? props.className : ''} ${props.isRed ? ' red-button' : ''}`}>
            {props.isLoading ? <BeatLoader color="white" size={8}/> : props.text}
        </button>
    )
}