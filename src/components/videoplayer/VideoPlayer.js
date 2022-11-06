import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid } from '@material-ui/core'
import '../home-container/gallery/PostGallery.css'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { token } from '../../WEB3_TOKEN'
import { Link } from 'react-router-dom'
import { SettingsInputAntenna } from '@material-ui/icons';
import { currentHash, currentDescription, currentTitle, videos } from '../video-gallery/VideoGallery';
import '../video-gallery/VideoGallery.css'

export default function VideoPlayer({ account, contractData }) {

    const [hash, setHash] = useState(currentHash)
    const [title, setTitle] = useState(currentTitle)
    const [description, setDescription] = useState(currentDescription)

    const changeVideo = (latestHash, latestTitle, latestDescription) => {
        setHash(latestHash)
        setTitle(latestTitle)
        setDescription(latestDescription)
    }

    useEffect(() => {
        console.log(currentHash)
        console.log(currentTitle)
        console.log(currentDescription)
        console.log(videos)
    },[])

  return (
    <div>
        <div className="row">
          <div className="col-md-10">
            <div
              className="embed-responsive embed-responsive-16by9"
              style={{ maxHeight: "720px" }}
            >
              <video
                src={`https://w3s.link/ipfs/${currentHash}`}
                controls
              ></video>
            </div>
            <div className="mt-3 ml-5">
              <h3>
                <b>
                  <i className="video-title">{title}</i>
                </b>
              </h3>
              <br />
              <p>{description}</p>
              <div className="mt-3">
                <p
                  style={{ fontWeight: "bold" }}
                >
                  IPFS CID:
                  <span>
                    {currentHash}
                  </span>
                </p>
                <p
                  style={{ fontWeight: "bold" }}
                >
                  Share IPFS URL:
                  <a
                    href={`https://w3s.link/ipfs/${currentHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{`https://w3s.link/ipfs/${hash}`}</a>
                </p>
              </div>
            </div>
          </div>
          <div
            className="vide-feed col-md-2 border border-secondary overflow-auto text-center"
            style={{ maxHeight: "1400px", minWidth: "175px" }}
          >
            <h5 className="feed-title">
              <b>
                Video Feed
                <span role="img" aria-label="video-emote">
                  📺
                </span>
              </b>
            </h5>
            {videos.map((video, key) => {
            //   return (
                <div
                  className="card mb-4 text-center bg-secondary mx-auto"
                  style={{ width: "250px", height: "175px" }}
                  key={key}
                >
                  <div className="card-title bg-dark">
                    <small className="text-white">
                      <b>{video.title}</b>
                    </small>
                  </div>
                  <div>
                    <p
                      onClick={() =>
                        changeVideo(video.hash, video.title, video.description)
                      }
                    >
                      <video
                        src={`https://w3s.link/ipfs/${video.hash}`}
                        style={{ width: "200px", height: "110px" }}
                      />
                    </p>
                  </div>
                </div>
            // );
            })}
          </div>
        </div>
    </div>
  )
}
