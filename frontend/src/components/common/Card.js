// frontend/src/components/common/Card.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Card = ({
    title,
    subtitle,
    content,
    image,
    footer,
    to,
    onClick,
    className,
    hoverEffect = true,
    shadow = 'md',
    padding = 'normal',
    rounded = 'md',
    border = false,
    children
}) => {
    // Shadow variants
    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl'
    };

    // Padding variants
    const paddingClasses = {
        none: 'p-0',
        small: 'p-3',
        normal: 'p-5',
        large: 'p-6'
    };

    // Rounded corner variants
    const roundedClasses = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
    };

    // Base classes
    const baseClasses = `
        bg-white 
        ${shadowClasses[shadow]} 
        ${paddingClasses[padding]} 
        ${roundedClasses[rounded]}
        ${border ? 'border border-gray-200' : ''}
        ${hoverEffect ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''}
        ${className || ''}
    `.trim().replace(/\s+/g, ' ');

    // Card content
    const cardContent = (
        <>
            {image && (
                <div className={`card-image ${padding !== 'none' ? '-mx-5 -mt-5 mb-5' : ''}`}>
                    {typeof image === 'string' ? (
                        <img 
                            src={image} 
                            alt={title || 'Card image'} 
                            className={`w-full object-cover ${roundedClasses[rounded === 'none' ? 'none' : 'md']} ${rounded !== 'none' ? 'rounded-b-none' : ''}`}
                        />
                    ) : (
                        image
                    )}
                </div>
            )}
            
            {title && (
                <div className="card-header mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            )}
            
            {content && (
                <div className="card-body">
                    {typeof content === 'string' ? (
                        <p className="text-gray-600">{content}</p>
                    ) : (
                        content
                    )}
                </div>
            )}
            
            {children}
            
            {footer && (
                <div className={`card-footer ${padding !== 'none' ? 'mt-4 pt-4 border-t border-gray-100' : ''}`}>
                    {footer}
                </div>
            )}
        </>
    );

    // Render as link if 'to' prop is provided
    if (to) {
        return (
            <Link to={to} className={`block ${baseClasses}`}>
                {cardContent}
            </Link>
        );
    }

    // Render as button if 'onClick' prop is provided
    if (onClick) {
        return (
            <button onClick={onClick} className={`text-left w-full ${baseClasses}`}>
                {cardContent}
            </button>
        );
    }

    // Default render as div
    return (
        <div className={baseClasses}>
            {cardContent}
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.node,
    subtitle: PropTypes.node,
    content: PropTypes.node,
    image: PropTypes.node,
    footer: PropTypes.node,
    to: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    hoverEffect: PropTypes.bool,
    padding: PropTypes.oneOf(['none', 'small', 'normal', 'large']),
    rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
    border: PropTypes.bool,
    children: PropTypes.node
};

export default Card;