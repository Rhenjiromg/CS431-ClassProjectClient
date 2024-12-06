import './CButtonStyles.css'
import PropTypes from "prop-types";

export default function Button({
    onClick, 
    ButtonType, 
    Title,
    className,
    isLoading,
    disabled,
}){

    let buttonType;
    switch (ButtonType) {
        case 'Outline':
            buttonType = 'OutlineButton';
            break;
        case 'Warn':
            buttonType = 'WarnButton';
            break;
        case 'Text':
            buttonType = 'TextButton';
            break;
        case 'WarnClear':
            buttonType = 'WarnClearButton';
            break;
        default:
            buttonType = 'SolidButton';
            break;
    }

    const isDisabled = disabled ?? false;
    return(
            <button 
            disabled={isLoading ?? isDisabled}
            className={`CustomButton ${buttonType} ${className}`} 
            onClick={onClick}
            >{(isLoading ?? false) ?  <div className={`${buttonType === 'TextButton' ? 'loader-black' : 'loader-color'}`}
            /> : Title ?? ''} 
            </button>
    )
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired, 
    ButtonType: PropTypes.oneOf(['Outline', 'Warn', 'Solid', 'Text', 'Warnclear']), 
    Title: PropTypes.string,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool
};