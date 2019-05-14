import React from 'react';
import './AssetList.css';
import Meta from '../Meta';

function AssetList(props) {
  const imageFileTypes = ["png", "jpg", "jpeg"];

  return (
    <>
      {props.assets && props.assets.map((a) => {
        return <div className="asset-list__asset" key={a.name}>
          <h2>{a.name}</h2>

          {imageFileTypes.some((v) => { return a.url.indexOf(v) >= 0; }) &&
            <img className="asset-list__asset-image" src={`/api/v1/tree/${a.url}`} alt={a.name} />
          }

          <div className="asset-list__asset-meta">
            <Meta title="Download"><a className="asset-list__asset-download" href={`/api/v1/tree/${a.url}`} download>{a.name}</a></Meta>
            <Meta title="Size">{Math.round((a.size / 1024 / 1024) * 100) / 100} MB</Meta>
            <Meta title="Last Modified">{new Date(a.modified * 1000).toLocaleString()}</Meta>
          </div>
        </div>;
      })}
    </>
  );
}

export default AssetList;