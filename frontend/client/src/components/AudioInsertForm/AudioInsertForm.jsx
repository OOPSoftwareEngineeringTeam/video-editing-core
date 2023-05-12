import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { Button } from 'antd';
import { Dialog, DialogActions, Chip } from "@mui/material";
import './AudioInsertForm.css'
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomizedSlider from "../VideoInput/Silder";


function AudioInsertForm({ videoList, audioList, open, handleClose, handleAddMusic }) {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const totalVideoLength = videoList.reduce((total, video) => total + (video.endTime - video.startTime), 0);
  const handleAudioChange = (value) => {
    value.endTime = totalVideoLength > value.endTime ? value.endTime : totalVideoLength
    setSelectedAudio({ ...value });
  };

  const DraggableChip = ({ audio }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "audio",
      item: { audio },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));
    return (
      <div ref={drag}>
        <Chip label={audio.label} />
      </div>
    );
  }
  const handleChangeSlide = (event, newValue) => {
    const value = { ...selectedAudio }
    value.width = newValue[0]
    value.height = newValue[1]
    setSelectedAudio(value);
  }
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "audio",
    drop: (item, monitor) => {
      return handleAudioChange({ ...item?.audio })
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Dialog open={open} fullScreen={true}>
      <div>Total video length: {totalVideoLength} seconds</div>
      <div className="audio-panel" style={{ display: 'flex', flexDirection: 'row' }}>
        {audioList?.map((audio, index) => (
          <DraggableChip key={index} audio={audio} />
        ))}
      </div>
      <div className="edit-panel">
        <div className="timeline-container">
          <div className="video-track">
            <div className="label">Timeline Video</div>
            <div className="track">
              <CustomizedSlider
                duration={totalVideoLength}
                videoPieceTime={[0, totalVideoLength]}
              />
            </div>
          </div>
          <div className="audio-track" ref={drop}>
            <div className="label">Timeline Audio</div>
            <div className="track">
              {selectedAudio && (
                <CustomizedSlider
                  duration={totalVideoLength}
                  videoPieceTime={[selectedAudio.width, selectedAudio.height]}
                  handleSlideChange={handleChangeSlide}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <DialogActions>
        <Button variant="contained" onClick={() =>
          handleAddMusic({ ...selectedAudio, height: selectedAudio.height < totalVideoLength ? selectedAudio.height : totalVideoLength })}>
          Save
        </Button>
        <Button
          sx={{
            backgroundColor: "red",
            marginLeft: "10px",

          }}
          variant="contained"
          onClick={() => {
            handleAddMusic(null)
            setSelectedAudio(null);
            handleClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AudioInsertForm;