import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { search } from "../../backend/backend";
import './searchResults.css';

export default function SearchResults() {
    const { searchvalue } = useParams();
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchvalue) {
                const data = await search(searchvalue); 
                setSearchResult(data);
            }
        };
        fetchSearchResults();  
    }, [searchvalue]);  

    const navigate = useNavigate();
    const navigateTo = (username) => {
        navigate(`/userprofile/${username}`);
    }

    const goBack = () => {
        navigate(-1);  // This will take the user back to the previous page
    }

    return (
        <div className="searchResultContainer">
            <button className="backButton" onClick={goBack}>Back</button>  {/* Back button */}
            <h1>Search Results for: {searchvalue}</h1>
            {searchResult.map((profile) => (
            <div key={profile.username} className="profile">
                <button onClick={()=>navigateTo(profile.username)} className="profileButton">
                    <p className="profileUsername">{profile.username}</p> 
                <p className="profileName">{profile.first_name} {profile.last_name}</p> 
            </button>
            </div>
            ))}
        </div>
    );
}
