import { useCountUp } from "../hooks/useCountUp";
import "./StatCard.css";

function StatCard({
  title,
  value,
  subtitle,
  extra,
  children
}) {
  const isNumeric = typeof value === "number";
  const animatedValue = useCountUp(isNumeric ? value : 0);

  return (

    <div className="stat-card">

      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{isNumeric ? animatedValue : value}</p>
      {
        subtitle &&
        <small className="stat-subtitle">{subtitle}</small>
      }
      {
        extra &&
        <small className="stat-subtitle">{extra}</small>
      }
      {children}

    </div>
  );
}

export default StatCard;