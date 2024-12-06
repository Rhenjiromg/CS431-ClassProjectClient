import PropTypes from "prop-types";
import './InputStyles.css';

export default function Input({placeholder, setText, value, className, inputStyle, type, multiline, disabled}){

    let customType = 'Outline';
    switch (inputStyle) {
        case 'Outline':
            customType = 'Outline';
            break;
        default:
            break;
    }

    return (
        <input 
        placeholder={placeholder || ''}
        onChange={(e) => setText(e.target.value)} 
        value={value}
        className={`InputStyles ${customType} ${className}`}
        type={type || ''}
        disabled={disabled || false}
        />
    )
}

Input.propTypes = {
    placeholder: PropTypes.string,
    setText: PropTypes.func.isRequired, 
    value: PropTypes.string.isRequired,
    className: PropTypes.string, 
    inputStyle: PropTypes.oneOf(['Outline']).isRequired,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    multiline: PropTypes.bool,
}