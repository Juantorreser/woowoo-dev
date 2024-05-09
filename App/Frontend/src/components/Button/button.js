import React from 'react';
import './button.css'

const STYLES=[
    'btn--primary',
    'btn--outline'
]

const SIZES=[
    'btn--bar',
    'btn--cards'
]

export const Button = ({
     children, 
     type,
     onCLick,
     buttonStyle,
     buttonSize
})=>{
    const checkButtonStyle=STYLES.includes(buttonStyle)?buttonStyle:STYLES[0]
    const checkButtonSize =SIZES.includes(buttonSize)? buttonSize:SIZES[0]
    return(
        <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} 
        onClick={onCLick} type={type}>
            {children}
        </button>
    )
}