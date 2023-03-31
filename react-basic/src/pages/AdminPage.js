import { Link } from "react-router-dom";
import BliogList from "../component/BlogList";

const AdiminPage = ({addToast}) => {    
    return (
        <div>
            <div className="d-flex justify-content-between">
                <h1>Admin</h1>
                <div>
                    <Link to="/blogs/create" className="btn btn-success">
                        Create New
                    </Link>
                </div>
            </div>
            <BliogList isAdmin={true} addToast={addToast} />
        </div>
    );
};

export default AdiminPage;