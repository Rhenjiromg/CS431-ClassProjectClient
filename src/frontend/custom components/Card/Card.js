import './CardStyles.css'
export default function Card({ children, className }){
    return (
        <div className={`CardContainer ${className}`}>
            {children}
        </div>
    )
}