//Posts Component

//Import Material UI Data tables
import MUIDataTable from "mui-datatables";
import { useContext } from "react";
import { PostContext } from "../PostContext";

//MUIDataTable config
const MUI_OPTIONS = {
    filterType: 'checkbox',
};

function Posts() {
    const {posts, postKeys} = useContext(PostContext);

    return (
        <>
            <h1>Posts</h1>
            <hr />
            <div className="dataTable_container">
                {posts.length > 0 && postKeys.length > 0  ? <MUIDataTable
                    title={"Posts Table"}
                    data={posts}
                    options={MUI_OPTIONS}
                    columns={postKeys}
                /> : <span>No Records Found</span>}
                
            </div>
        </>
    );
}

export { Posts };