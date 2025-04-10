function Alert({ alert, showAlert }) {
  if (!showAlert) return null;
  return (
    <div>
      {alert.success ? (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {alert.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      ) : (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {alert.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
    </div>
  );
}

export default Alert;
