import { useState, useEffect, useRef } from 'react';
import useWindow from '../hooks/use-window';
import { MapMarkerDot, MapMarkerPointer, MapMarkerWrapper } from './styled-components';

const Marker = (props) => {
  const markerRadius = 6;
  let markerLeftRadius = markerRadius;
  let markerTopRadius = markerRadius;

  if (props.markerPointer?.value?.width && props.markerPointer?.value?.height) {
    const koef = props.markerPointer.value.height / props.markerPointer.value.width;

    // depends on ".map-marker-pointer" from styles
    markerTopRadius = 10;
    markerLeftRadius = markerTopRadius / koef;
  }

  const markerShiftX = markerLeftRadius / props.mapRect.width * 100;
  const markerShiftY = markerTopRadius / props.mapRect.height * 100;
  const [posX, setPosX] = useState(String(props.coords.xPoint - markerShiftX) + '%');
  const [posY, setPosY] = useState(String(props.coords.yPoint - markerShiftY) + '%');
  const [isMarkerSelected, setIsMarkerSelected] = useState(props.isSelected);

  const screenSize = useWindow();
  const markerRef = useRef(null);

  const selectMarker = () => {
    setIsMarkerSelected(true);
    props.selectMarker(props.coords.id || 0);
  };

  useEffect(() => {
    const marker = markerRef.current;

    if (marker) {
      marker.onmousedown = function (e) {
        e.preventDefault(); //  disabled default selection of content

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        function onMouseMove(e) {
          const scrollTop = window.scrollY;
          let newLeft = e.clientX - props.mapRect.left - markerLeftRadius;

          const offsetTop = ((document.getElementsByClassName('resort-map')[0]) as HTMLElement).offsetTop;



          let newTop = e.clientY - offsetTop - markerTopRadius + scrollTop;

          if (newLeft < 0) {
            newLeft = 0;
          }
          console.log(newTop, "TOP");
          if (newTop < 0) {
            newTop = 0;
          }

          let rightEdge = 0;
          let bottomEdge = 0;

          if (marker) {
            rightEdge = props.mapRect.width - marker.offsetWidth;
            bottomEdge = props.mapRect.height - marker.offsetHeight;
          }

          if (newLeft > rightEdge) {
            newLeft = rightEdge;
          }

          if (newTop > bottomEdge) {
            newTop = bottomEdge;
          }

          let newLeftConverted = newLeft / props.mapRect.width * 100;
          let newTopConverted = newTop / props.mapRect.height * 100;

          if (marker) {
            marker.style.left = newLeftConverted + '%';
            marker.style.top = newTopConverted + '%';
          }

          props.updateMarker({
            id: props.coords.id,
            newX: newLeftConverted + markerShiftX,
            newY: newTopConverted + markerShiftY
          });
        }

        function onMouseUp() {
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        }
      }
      marker.ondragstart = function () {
        return false;   //  disabled D&D of browser
      };
    }
  }, [props.coords.id, props.mapRect.width, props.mapRect.height, screenSize.width, screenSize.height]);

  useEffect(() => {
    setPosX(String(props.coords.xPoint - markerShiftX) + '%');
    setPosY(String(props.coords.yPoint - markerShiftY) + '%');
  }, [props.coords.xPoint, props.coords.yPoint]);


  useEffect(() => {
    setIsMarkerSelected(props.isSelected);
  }, [props.isSelected]);

  return (
    <>
      <MapMarkerWrapper
        ref={markerRef}
        onMouseDown={selectMarker}
        style={{
          left: posX,
          top: posY
        }}
      >
        {!props.markerPointer?.value?.url &&
          <MapMarkerDot
            selected={isMarkerSelected}
            style={{ backgroundColor: props.markerColor }}
          />
        }
        {props.markerPointer?.value?.url &&
          <MapMarkerPointer
            selected={isMarkerSelected}
            src={props.markerPointer?.value?.url}
            alt={props.coords.title}
          />
        }
      </MapMarkerWrapper>
    </>
  );
};

export default Marker;
