import BliogList from "../component/BlogList";

const ListPage = () => {
    return (
        <div>
            <div className="d-flex justify-content-between">
                <h1>Blogs</h1>
            </div>
            <BliogList isAdmin={false}/>
        </div>
    );
};

export default ListPage;