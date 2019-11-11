import React from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import styles from './view.module.css';

const buildMarkers = buildingInfo => {
  const buildings = buildingInfo.map(building => {
    const build = { ...building };
    build.position = [build.latitude, build.longitude];
    delete build.latitude;
    delete build.longitude;
    return build;
  });
  const markers = buildings.map(element => {
    const {
      id,
      position,
      thumbnail,
      city,
      address,
      previousUse,
      owner,
      emptyPeriod,
      isOwnerLocal,
      approved,
    } = element;
    return (
      <Marker position={position} key={id}>
        <Popup>
          <img
            src={thumbnail}
            alt="building"
            className={styles.building__img}
          />
          <div className={styles.popup__content}>
            <h2 className={styles.building__city}>
              {city}
              <span className={styles.ownerLocal}>
                {isOwnerLocal.toLowerCase() === 'yes' ? (
                  <Tag className={styles.ownerLocal__active}>Local Owner</Tag>
                ) : null}
              </span>
            </h2>

            <h4>
              <span className={styles.building__title}>Address:</span> {address}
            </h4>
            <h4>
              <span className={styles.building__title}>Previous Use:</span>{' '}
              {previousUse}
            </h4>
            <h4>
              <span className={styles.building__title}>Owner: </span> {owner}
            </h4>
            <h4>
              <span className={styles.building__title}>Empty Period: </span>
              {emptyPeriod}
            </h4>
            <h4>
              <span className={styles.approved}>
                {approved ? (
                  <Tag color="green">Approved</Tag>
                ) : (
                  <Tag color="red">Pending</Tag>
                )}
              </span>
            </h4>
          </div>
        </Popup>
      </Marker>
    );
  });
  return markers;
};

const MapComponent = ({ buildingInfo }) => {
  return (
    <Map
      center={[51.509865, -0.118092]}
      zoom={6}
      className={styles.map}
      maxBounds={[
        { lat: 56.25501647203477, lng: -16.853027343750004 },
        { lat: 49.83994655735523, lng: -17.072753906250004 },
        { lat: 49.85410987531622, lng: 10.458984375000002 },
        { lat: 56.30379004315596, lng: 10.72265625 },
      ]}
    >
      <TileLayer
        url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
        id="mapbox.streets"
        accessToken={process.env.REACT_APP_MAP_ACCESS_TOKEN}
      />
      {buildingInfo.length ? buildMarkers(buildingInfo) : null}
    </Map>
  );
};

MapComponent.propTypes = {
  buildingInfo: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default MapComponent;