import { ButtonHTMLAttributes } from 'react';

import '../styles/button.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {fitContent?: boolean}

export function Button({fitContent = false, ...props}: ButtonProps){
    return (
        <button
        // className="button"
            className={`button ${fitContent ? 'fit-content' : ''}`}
            {...props }/>
    )
}