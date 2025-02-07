import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import {useEffect, useState} from "react";
import {Link} from "react-router";

function CustomCards({props, recommendations}) {
    const [ratings, setRatings] = useState(null);

    useEffect(() => {

        setRatings(
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(props.ratings)].map((_, index) => (
                    <StarIcon key={index} style={{ color: '#FFD700' }} />
                ))}
            </div>
        );
    }, []);

    function handleClick() {

    }

    return (
        <>
            { recommendations ? (
                <a href={`/restaurant/${props.id}`}>
                    <div
                        style={{
                            marginBottom: '20px',
                            backgroundColor: 'white',
                            paddingBottom: '5px',
                            borderRadius: '5px',
                            boxShadow: ' 0 2px 10px 0 rgba(0, 0, 0, 0.19)',
                            width: '300px',
                        }}
                        onClick={() => handleClick(props.id)}
                    >
                        {/*Image frame*/}
                        <img src={props.thumb_img_url} style={{
                            height: '200px',
                            width: '300px',
                            borderTopRightRadius: '5px',
                            borderTopLeftRadius: '5px',
                            margin: '0px'
                        }}></img>
                        <div style={{padding: '0 10px', paddingTop: '5px'}}>
                            <p style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{props.name}</p>
                            <p>{ratings}</p>
                        </div>
                    </div>
                </a>
            ) : (
                <a href={`/restaurant/${props.id}`}>
                    <div
                        style={{
                            marginBottom: '20px',
                            backgroundColor: 'white',
                            paddingBottom: '5px',
                            borderRadius: '5px',
                            boxShadow: ' 0 2px 10px 0 rgba(0, 0, 0, 0.19)',
                        }}
                        onClick={() => handleClick(props.id)}
                    >
                        {/*Image frame*/}
                        <img src={props.thumb_img_url} style={{
                            height: '300px',
                            width: '100%',
                            maxWidth: '600px',
                            borderTopRightRadius: '5px',
                            borderTopLeftRadius: '5px'
                        }}></img>
                        <div style={{padding: '0 10px', paddingTop: '5px'}}>
                            <p>{props.name}</p>
                            <p>{ratings}</p>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <LocationOnIcon
                                        style={{
                                            color: "#FD843D",
                                            width: '16px',
                                            marginBottom: 'auto'
                                        }}></LocationOnIcon>
                                    <p style={{color: '#918D8D'}}>{props.address}</p>
                                </div>

                        </div>
                    </div>
                </a>
            )}
        </>
    )
}

export default CustomCards;