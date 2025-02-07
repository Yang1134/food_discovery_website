import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import StarIcon from "@mui/icons-material/Star";

function MarkerWithInfoWindow({ position, data, onClick }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(true);

  const handleMarkerClick = useCallback(() => {
    setInfoWindowShown((isShown) => !isShown);
    if (onClick) onClick(); // Trigger the onClick callback if provided
  }, [onClick]);

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
      <>
        <AdvancedMarker
            ref={markerRef}
            position={position}
            onClick={ () => {
                setInfoWindowShown(!infoWindowShown)
            } }
        />
          {infoWindowShown && (
              <InfoWindow
                  anchor={marker}
              >
                  <div style={{width: '200px', cursor: 'pointer'}}
                       onClick={ () => { setInfoWindowShown(!infoWindowShown)} }
                  >
                      <img src={data.thumb_img_url} style={{height: '200px', width: '200px'}}></img>
                      <p style={{padding: '5px 0'}}>{data.name}</p>
                      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center'}}>
                          <p style={{color: "#918D8D", fontWeight: 'normal'}}>Ratings: </p>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                              {[...Array(data.ratings)].map((_, index) => (
                                  <StarIcon key={index} style={{color: '#FFD700'}}/>
                              ))}
                          </div>
                      </div>
                  </div>
              </InfoWindow>
          )}
      </>
  );
}

export default MarkerWithInfoWindow;
