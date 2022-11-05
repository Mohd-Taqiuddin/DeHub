import React, { useEffect, useState } from 'react'
import { useHistory, Link } from "react-router-dom";
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid } from '@material-ui/core'
import '../home-container/gallery/PostGallery.css'
import VideoPlayer from '../videoplayer/VideoPlayer'
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { token } from '../../WEB3_TOKEN'
import './VideoGallery.css'

export default function VideoGallery({ account, contractData }) {
    const [postsData, setPostsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [videoCount, setVideocount] = useState(0);
    const [hash, setHash] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const history = useHistory();

    const dtube = contractData;

    const client = new Web3Storage({ token: token });
  
    useEffect(() => {
      const loadPosts = async () => {
        try {
            setLoading(true)
            const videosCount = await contractData.methods.videoCount().call()
            console.log(videosCount)
            setVideocount(videosCount);

            // Load videos, sort by newest
            for (var i = videosCount; i >= 1; i--) {
                const video = await contractData.methods.videos(i).call();
                setPostsData([...postsData, video]);
            }

            const latest = await contractData.methods.videos(videoCount).call();
            setHash(latest.hash)
            setTitle(latest.title)
            setDescription(latest.description)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
      }
      loadPosts()
    }, [])

    const handleClick = (event) => {
        console.log("clicked!!");
        history.push("/video");
    }
  
    return (
      <div style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
         {/* Add post's Data */}
         {
          loading ? (
            <CircularStatic />
          ) : (
            <div style={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                {/* {postsData.length ? (
                  postsData.map((post, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <ImageListItem style={{ height: '480px', listStyle: 'none' }}>
                        <img src={post.image} alt={post.name} />
                        <ImageListItemBar
                          title={post.name}
                          subtitle={<span>by: {post.description}</span>}
                          actionIcon={
                            <IconButton
                              aria-label={`info about ${post.name}`}
                              className="icon"
                            >
                              <Button
                                variant="contained"
                                size="small"
                                component={Link}
                                to={`/post-details/${post.cid}`}
                                className="view-btn"
                              >
                                View
                              </Button>
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    </Grid>
                  ))
                ) : (
                  <h2>No Posts Yet...</h2>
                )} */}
                {postsData.length ? (
                    postsData.map((video, key) => {
                    return (
                        <div
                        className="card mb-4 text-center bg-secondary mx-auto"
                        style={{ width: "500px", height: "380   px" }}
                        key={key}
                        >
                        <div className="card-title bg-dark">
                            <small className="text-white">
                            <b>{video.title}</b>
                            </small>
                        </div>
                        <div>
                            <p
                            onClick={handleClick}
                            >
                                <video
                                    src={`https://w3s.link/ipfs/${video.hash}`}
                                    style={{ width: "480px", height: "360px" }}
                                />
                                <p>
                                    {video.title}
                                    {<span>by: {video.author}</span>}
                                    Description: {video.description}
                                </p>
                            </p>
                        </div>
                        </div>
                    );
                    })) : (
                        <h2>No Videos Yet...</h2>

                    )
                }
              </Grid>
              <p className='uploadLink'>
                    Share a video?
                    <Link to="/upload-video">Click here</Link>
                </p>
            </div>
          )
        }
  
      </div>
    )
}
