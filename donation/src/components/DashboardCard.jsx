const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome");

const DashboardCard = ({ icon, color, title, description, onClick }) => (
    <div className="col">
      <div
        className="card shadow-sm border-0 rounded-3 p-4 text-center hover-shadow-lg h-100 d-flex flex-column"
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={icon} size="3x" className={`mb-3 text-${color}`} />
        <h3>{title}</h3>
        <p className="text-muted">{description}</p>
      </div>
    </div>
  );

export default DashboardCard;