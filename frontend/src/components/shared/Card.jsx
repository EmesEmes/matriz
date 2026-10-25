const Card = ({ 
  title, 
  children, 
  className = "",
  headerActions = null,
  padding = "p-6"
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {title && (
        <div className={`flex justify-between items-center border-b pb-4 ${padding}`}>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className={title ? padding : padding}>
        {children}
      </div>
    </div>
  );
};

export default Card;